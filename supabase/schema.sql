-- Shiv Car Detailing Studio — Full Database Schema
-- Paste ALL of this in Supabase SQL Editor and click Run
-- https://supabase.com/dashboard/project/vmzflvtaaotrqpgbdweo/sql/new

-- Drop existing tables in dependency order (safe to re-run)
drop table if exists public.payments cascade;
drop table if exists public.invoice_items cascade;
drop table if exists public.quotation_items cascade;
drop table if exists public.invoices cascade;
drop table if exists public.quotations cascade;
drop table if exists public.customers cascade;
drop table if exists public.doc_settings cascade;
drop table if exists public.company_settings cascade;

-- company_settings
create table public.company_settings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique,
  company_name text not null default '',
  logo_url     text,
  address      text not null default '',
  phone        text not null default '',
  email        text not null default '',
  website      text not null default '',
  gstin        text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.company_settings enable row level security;
create policy "owner only" on public.company_settings
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- doc_settings
create table public.doc_settings (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null unique,
  qtn_prefix           text    not null default 'QTN',
  qtn_next_number      integer not null default 1,
  qtn_validity_days    integer not null default 30,
  qtn_terms            text    not null default '',
  inv_prefix           text    not null default 'INV',
  inv_next_number      integer not null default 1,
  inv_payment_days     integer not null default 30,
  inv_terms            text    not null default '',
  default_gst_percent  numeric not null default 18,
  allow_item_level_gst boolean not null default true,
  bank_account_name    text    not null default '',
  bank_name            text    not null default '',
  bank_account_number  text    not null default '',
  bank_ifsc            text    not null default '',
  bank_upi             text    not null default '',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
alter table public.doc_settings enable row level security;
create policy "owner only" on public.doc_settings
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- customers
create table public.customers (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null,
  name            text not null,
  company_name    text not null default '',
  phone           text not null default '',
  email           text not null default '',
  address         text not null default '',
  ship_to_address text not null default '',
  gstin           text not null default '',
  notes           text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table public.customers enable row level security;
create policy "owner only" on public.customers
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index customers_user_id_idx on public.customers(user_id);

-- quotations
create table public.quotations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null,
  customer_id      uuid not null references public.customers(id) on delete restrict,
  quotation_number text not null,
  date             date not null,
  valid_until      date,
  status           text not null default 'draft',
  place_of_supply  text not null default 'Gujarat (24)',
  subtotal         numeric not null default 0,
  discount_amount  numeric not null default 0,
  taxable_amount   numeric not null default 0,
  gst_amount       numeric not null default 0,
  grand_total      numeric not null default 0,
  notes            text not null default '',
  terms            text not null default '',
  prepared_by      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.quotations enable row level security;
create policy "owner only" on public.quotations
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index quotations_user_id_idx on public.quotations(user_id);

-- quotation_items
create table public.quotation_items (
  id               uuid primary key default gen_random_uuid(),
  quotation_id     uuid not null references public.quotations(id) on delete cascade,
  description      text    not null default '',
  hsn_code         text    not null default '',
  quantity         numeric not null default 1,
  rate             numeric not null default 0,
  discount_percent numeric not null default 0,
  gst_percent      numeric not null default 18,
  base_amount      numeric not null default 0,
  discount_amount  numeric not null default 0,
  taxable_amount   numeric not null default 0,
  gst_amount       numeric not null default 0,
  amount           numeric not null default 0,
  sort_order       integer not null default 0
);
alter table public.quotation_items enable row level security;
create policy "owner via quotation" on public.quotation_items
  using (exists (
    select 1 from public.quotations
    where quotations.id = quotation_id and quotations.user_id = auth.uid()
  ));
create index qtn_items_quotation_id_idx on public.quotation_items(quotation_id);

-- invoices
create table public.invoices (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null,
  customer_id      uuid not null references public.customers(id) on delete restrict,
  quotation_id     uuid,
  invoice_number   text not null,
  date             date not null,
  due_date         date,
  payment_status   text not null default 'pending',
  subtotal         numeric not null default 0,
  discount_amount  numeric not null default 0,
  taxable_amount   numeric not null default 0,
  gst_amount       numeric not null default 0,
  grand_total      numeric not null default 0,
  amount_paid      numeric not null default 0,
  balance_due      numeric not null default 0,
  notes            text not null default '',
  terms            text not null default '',
  prepared_by      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.invoices enable row level security;
create policy "owner only" on public.invoices
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index invoices_user_id_idx on public.invoices(user_id);

-- invoice_items
create table public.invoice_items (
  id               uuid primary key default gen_random_uuid(),
  invoice_id       uuid not null references public.invoices(id) on delete cascade,
  description      text    not null default '',
  hsn_code         text    not null default '',
  quantity         numeric not null default 1,
  rate             numeric not null default 0,
  discount_percent numeric not null default 0,
  gst_percent      numeric not null default 18,
  base_amount      numeric not null default 0,
  discount_amount  numeric not null default 0,
  taxable_amount   numeric not null default 0,
  gst_amount       numeric not null default 0,
  amount           numeric not null default 0,
  sort_order       integer not null default 0
);
alter table public.invoice_items enable row level security;
create policy "owner via invoice" on public.invoice_items
  using (exists (
    select 1 from public.invoices
    where invoices.id = invoice_id and invoices.user_id = auth.uid()
  ));
create index inv_items_invoice_id_idx on public.invoice_items(invoice_id);

-- payments
create table public.payments (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null,
  invoice_id       uuid not null references public.invoices(id) on delete cascade,
  amount           numeric not null,
  payment_date     date    not null,
  payment_method   text    not null default 'cash',
  reference_number text    not null default '',
  notes            text    not null default '',
  created_at       timestamptz not null default now()
);
alter table public.payments enable row level security;
create policy "owner only" on public.payments
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index payments_user_id_idx on public.payments(user_id);
create index payments_invoice_id_idx on public.payments(invoice_id);
