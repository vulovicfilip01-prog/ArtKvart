-- 1. Kreiranje tabele za Profile (Umetnike)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  bio TEXT,
  location TEXT,
  category TEXT,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Uključivanje Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Polise za profile (svako može da vidi profile, samo vlasnik može da menja)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);


-- 2. Kreiranje tabele za Radove (Artworks)
CREATE TABLE artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Uključivanje RLS za radove
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Polise za radove (svako može da vidi radove, ulogovani kreiraju svoje)
CREATE POLICY "Artworks are viewable by everyone." ON artworks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own artworks." ON artworks
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Users can update their own artworks." ON artworks
  FOR UPDATE USING (auth.uid() = artist_id);
  
CREATE POLICY "Users can delete their own artworks." ON artworks
  FOR DELETE USING (auth.uid() = artist_id);


-- Opciono: Funkcija koja automatski kreira profil kada se korisnik registruje (preko auth.users)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Okidač (Trigger) koji poziva funkciju gore
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. Kreiranje tabele za Lajkove (Likes)
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, artwork_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone." ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes." ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes." ON likes
  FOR DELETE USING (auth.uid() = user_id);


-- 4. Kreiranje tabele za Praćenja (Follows)
CREATE TABLE follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are viewable by everyone." ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own follows." ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows." ON follows
  FOR DELETE USING (auth.uid() = follower_id);


-- 5. Kreiranje tabele za Komentare (Comments)
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone." ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments." ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments." ON comments
  FOR DELETE USING (auth.uid() = user_id);


-- 6. Dodavanje kolone za broj pregleda na radovima (ako već ne postoji)
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;


-- 7. Kreiranje tabele za Poruke / Upite (Messages - Inboks)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages sent to them." ON messages
  FOR SELECT USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

CREATE POLICY "Anyone can send a message to an artist." ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Receivers can delete their messages." ON messages
  FOR DELETE USING (auth.uid() = receiver_id);


-- 8. Kreiranje tabele za Oglase za posao (Jobs)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  job_type TEXT,
  category TEXT,
  budget TEXT,
  contact_email TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone." ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can post jobs." ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs." ON jobs
  FOR DELETE USING (auth.uid() = user_id);


-- 9. Dodatne kolone za prodaju radova (price) i društvene mreže / dostupnost umetnika
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_for_work BOOLEAN DEFAULT true;



