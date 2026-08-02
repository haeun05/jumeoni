# 우체국 개국 준비 — Supabase 연결 3단계

실제 매칭·편지 배달·모두의 지도를 켜려면 서버가 필요해요.
Supabase 무료 요금제로 충분하고, 아래 3단계만 직접 해주면
나머지 연동 코드는 Claude가 이어서 작업합니다.

## 1. 가입 + 프로젝트 만들기 (약 3분)
1. https://supabase.com 접속 → **Start your project** → GitHub 계정으로 가입
2. **New project** → 이름 `jumeoni`, 리전 `Northeast Asia (Seoul)` 선택 → 생성

## 2. 스키마 실행 (약 1분)
1. 왼쪽 메뉴 **SQL Editor** → **New query**
2. 이 저장소의 `supabase/schema.sql` 내용을 통째로 붙여넣고 **Run**

## 3. 열쇠 두 줄 전달
1. 왼쪽 메뉴 **Project Settings → API**
2. 아래 두 값을 복사해서 Claude에게 알려주기 (anon key는 공개용이라 괜찮아요):
   - `Project URL` (https://xxxx.supabase.co)
   - `anon public` key

이후 Claude가 하는 일:
- config.js 생성 + supabase-js 연동
- 우체국: 실제 매칭 대기열 → 편지 부치면 상대에게 아침 9시 배달
- 지도: 내 편지가 모두의 지도에 뜨고, 대화 신청이 상대 우편함으로
- 여정: 매화(체험판) 대신 진짜 상대와 3통 문답 개방 · 7통 만남 신청
