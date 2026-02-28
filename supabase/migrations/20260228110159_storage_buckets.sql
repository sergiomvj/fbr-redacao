-- Create Buckets
insert into storage.buckets (id, name, public) values ('media', 'media', true);
insert into storage.buckets (id, name, public) values ('ugc', 'ugc', false);

-- Set Up Media Policies (Read public, Write operators only)
create policy "Media Public Read" on storage.objects for select using (bucket_id = 'media');
create policy "Media Operator Insert" on storage.objects for insert with check (bucket_id = 'media' and exists (select 1 from public.users where auth_id = auth.uid() and role = 'operator'));
create policy "Media Operator Update" on storage.objects for update using (bucket_id = 'media' and exists (select 1 from public.users where auth_id = auth.uid() and role = 'operator'));
create policy "Media Operator Delete" on storage.objects for delete using (bucket_id = 'media' and exists (select 1 from public.users where auth_id = auth.uid() and role = 'operator'));

-- Set Up UGC Policies (Upload only for Users, Read by Operators & Owners)
create policy "UGC Owner Read" on storage.objects for select using (bucket_id = 'ugc' and auth.uid() = owner);
create policy "UGC Operator Read" on storage.objects for select using (bucket_id = 'ugc' and exists (select 1 from public.users where auth_id = auth.uid() and role = 'operator'));
create policy "UGC User Insert" on storage.objects for insert with check (bucket_id = 'ugc' and auth.uid() = owner);
