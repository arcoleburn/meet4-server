create table locations(
  id uuid primary key default uuid_generate_v4 (),
  user_id uuid references users(id) on delete cascade,
  location_name text not null, 
  location_address text not null
);

