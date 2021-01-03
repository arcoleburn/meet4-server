create table stats(
  id uuid primary key uuid_generate_v4 (),
  user_id references users(id) on delete cascade,
  pizza_count integer default 0,
  coffee_count integer default 0,
  beer_count integer default 0
);

