-- ============================================================
-- 주머니 우체국 개국 스키마 (Supabase SQL Editor에 붙여넣어 실행)
-- 원칙: 개인정보를 저장하지 않는다. 필명과 문장이 전부다.
-- ============================================================

-- 필명 (익명 프로필 — 이메일도 이름도 없다)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  device_key text unique not null,          -- 브라우저가 만든 익명 키
  penname text not null,
  seeking text default '아직 몰라요',        -- 벗 | 연인 | 모임 | 아직 몰라요
  lang text default 'ko',
  answers jsonb default '{}'::jsonb,        -- 취향 문답 (세 통째에 상호 공개)
  banned boolean default false,
  created_at timestamptz default now()
);

-- 매칭 대기열: 우체국이 정해주는 무작위 짝 (프로필 탐색 화면은 없다)
create table if not exists queue (
  profile_id uuid primary key references profiles(id) on delete cascade,
  enqueued_at timestamptz default now()
);

-- 두 필명 사이의 편지 여정
create table if not exists threads (
  id uuid primary key default gen_random_uuid(),
  a uuid not null references profiles(id),
  b uuid not null references profiles(id),
  letter_count int default 0,
  status text default 'active',             -- active | paused | met | drifted
  meet_request jsonb,                       -- {from: uuid, as: '벗|연인|모임', at: ts}
  met_as text,                              -- 양쪽 수락 시 확정
  created_at timestamptz default now()
);

-- 편지: 다음 아침 9시(+묵힘 일수)에 배달된다
create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads(id) on delete cascade,
  sender uuid not null references profiles(id),
  body text not null,
  body_translated text,                     -- 해외 상대용 자동 번역
  aged_days int default 0,                  -- 묵힌 편지 (0 | 3 | 7)
  written_at timestamptz default now(),
  deliver_at timestamptz not null,
  read_at timestamptz
);

-- 지도 편지 (모두의 지도)
create table if not exists map_letters (
  id uuid primary key default gen_random_uuid(),
  author uuid not null references profiles(id),
  lat double precision not null,
  lng double precision not null,
  place_label text default '',
  body text not null,
  created_at timestamptz default now()
);

-- 지도 대화 신청: 상대 우편함으로 첫 편지가 배달된다
create table if not exists talks (
  id uuid primary key default gen_random_uuid(),
  map_letter_id uuid not null references map_letters(id) on delete cascade,
  from_profile uuid not null references profiles(id),
  status text default 'sent',               -- sent | thread_opened
  created_at timestamptz default now()
);

-- 봉인 신고
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reported uuid not null references profiles(id),
  reporter uuid not null references profiles(id),
  reason text,
  created_at timestamptz default now()
);

-- 배달 시각 계산: 다음 아침 9시 (KST) + 묵힘 일수
create or replace function next_delivery(aged int default 0)
returns timestamptz language sql stable as $$
  select (date_trunc('day', now() at time zone 'Asia/Seoul')
          + interval '1 day' * (1 + aged)
          + interval '9 hours') at time zone 'Asia/Seoul';
$$;

-- 우편함 뷰: 배달 시각이 지난 편지만 보인다 (느림을 DB가 지킨다)
create or replace view delivered_letters as
  select * from letters where deliver_at <= now();

-- RLS: 익명 클라이언트는 자기 device_key 기준으로만 읽고 쓴다
alter table profiles enable row level security;
alter table threads enable row level security;
alter table letters enable row level security;
alter table map_letters enable row level security;
alter table talks enable row level security;
alter table reports enable row level security;

-- (초기 오픈 단계: anon 읽기/쓰기 정책 — 운영 전 반드시 device_key 검증으로 좁힐 것)
create policy "profiles rw" on profiles for all using (true) with check (true);
create policy "threads rw" on threads for all using (true) with check (true);
create policy "letters rw" on letters for all using (true) with check (true);
create policy "map rw" on map_letters for all using (true) with check (true);
create policy "talks rw" on talks for all using (true) with check (true);
create policy "reports rw" on reports for all using (true) with check (true);
