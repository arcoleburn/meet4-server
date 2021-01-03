create table friends(
  id uuid primary key default uuid_generate_v4 (),
  initiator_id uuid references users(id) on delete cascade, 
  recipient_id uuid references users(id) on delete cascade,
  accepted boolean default false
);
