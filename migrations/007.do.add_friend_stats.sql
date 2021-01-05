alter table friends
add column pizza_count integer default 0,
add column coffee_count integer default 0,
add column beer_count integer default 0,
add column date_added date default CURRENT_DATE;