DROP TYPE IF EXISTS restaurant_type;
CREATE TYPE restaurant_type AS ENUM (
    'Coffee',
    'Pizza',
    'Beer',
);

create table favorites(
  id uuid primary key default uuid_generate_v4 (),
  user_id references users(id) on delete cascade,
  restaurant_name text not null,
  restaurant_address text not null, 
  category restaurant_type not null

);
