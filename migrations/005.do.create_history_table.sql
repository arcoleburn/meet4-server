create table history (
  id uuid primary key default uuid_generate_v4 (),
  user1_id uuid references users(id) on delete set null,
  user2_id uuid references users(id) on delete set null,
  user1_location text,
  user2_loaction text,
  meeting_date date not null default current_date,
  restaurant_name text,
  restaurant_address text,
  category restaurant_type not null
);

