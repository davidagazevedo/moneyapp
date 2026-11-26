-- CONTAS (carteira, conta corrente, poupança...)
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  name text not null,
  type text not null
    check (type in ('wallet', 'checking', 'savings', 'investment')),
  initial_balance_cents bigint not null default 0,
  created_at timestamptz not null default now()
);

-- CATEGORIAS (mercado, salário, transporte...)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('income', 'expense')),
  created_at timestamptz not null default now()
);

-- LANÇAMENTOS (receitas e despesas)
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  account_id uuid not null
    references public.accounts(id) on delete cascade,
  category_id uuid
    references public.categories(id) on delete set null,
  kind text not null check (kind in ('income', 'expense')),
  amount_cents bigint not null check (amount_cents > 0),
  date date not null,
  description text,
  created_at timestamptz not null default now()
);

-- ÍNDICES (deixam as consultas rápidas)
create index on public.accounts (user_id);
create index on public.categories (user_id);
create index on public.transactions (user_id, date desc);
create index on public.transactions (account_id);

-- SEGURANÇA: ligar o Row Level Security
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- Cada usuário só acessa as próprias linhas
create policy "own accounts" on public.accounts
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own categories" on public.categories
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Nos lançamentos, a conta também precisa ser do próprio usuário
create policy "own transactions" on public.transactions
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.accounts a
      where a.id = account_id and a.user_id = (select auth.uid())
    )
  );

  grant select, insert, update, delete
  on public.accounts, public.categories, public.transactions
  to authenticated;