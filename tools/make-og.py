#!/usr/bin/env python3
"""공유 미리보기 이미지(og:image) 생성기.

카카오톡·트위터 등은 SVG를 지원하지 않아 PNG가 필요하다.
macOS의 QuickLook(qlmanage)은 SVG를 정사각 캔버스에 맞춰 렌더링하므로,
1200x1200 정사각으로 그리되 실제 내용은 중앙 1200x630 밴드에 배치한 뒤
sips로 가운데를 잘라낸다.

  python3 tools/make-og.py
"""
import os
import shutil
import subprocess
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BAND_TOP = 285  # (1200 - 630) / 2

PAPER = "#fff9f2"
INK = "#52463d"
SOFT = "#b3a496"
CORAL = "#ee8b6c"
LAV = "#b9aee4"
LINE = "#f3e6d8"
BOLD = "AppleSDGothicNeo-Bold, Apple SD Gothic Neo, sans-serif"
REG = "AppleSDGothicNeo-Regular, Apple SD Gothic Neo, sans-serif"

PETALS = """
  <g fill="#f7cfd6">
    <ellipse cx="90" cy="70" rx="11" ry="8" transform="rotate(-20 90 70)" opacity=".8"/>
    <ellipse cx="1090" cy="120" rx="9" ry="7" transform="rotate(25 1090 120)" opacity=".7"/>
    <ellipse cx="1010" cy="520" rx="12" ry="9" transform="rotate(-35 1010 520)" opacity=".65"/>
    <ellipse cx="150" cy="540" rx="9" ry="7" transform="rotate(15 150 540)" opacity=".6"/>
    <ellipse cx="640" cy="45" rx="8" ry="6" transform="rotate(40 640 45)" opacity=".5"/>
  </g>
"""

BG = f"""
  <rect width="1200" height="1200" fill="{PAPER}"/>
  <g transform="translate(0,{BAND_TOP})">
    <circle cx="70" cy="60" r="260" fill="{CORAL}" opacity="0.07"/>
    <circle cx="1140" cy="600" r="280" fill="{LAV}" opacity="0.10"/>
"""


def pouch(x, y, s=1.0):
    """조임끈 주머니 일러스트."""
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <g transform="translate(60,-40) rotate(9)">
        <rect width="52" height="66" rx="5" fill="#fffdf8" stroke="{LINE}" stroke-width="3"/>
        <path d="M11 16 h30 M11 29 h30 M11 42 h20" stroke="#e0d3c2" stroke-width="3" stroke-linecap="round"/>
      </g>
      <path d="M0 40 Q-2 18 20 8 Q46 -2 85 -2 Q124 -2 150 8 Q172 18 170 40 L170 108
               Q170 196 85 204 Q0 196 0 108 Z" fill="#c9a37a"/>
      <path d="M24 8 Q29 28 24 44 M56 0 Q61 24 56 44 M85 -2 Q85 22 85 44
               M114 0 Q109 24 114 44 M146 8 Q141 28 146 44"
            stroke="rgba(82,70,61,0.20)" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M4 46 Q85 72 166 46" stroke="#8a6a45" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M12 52 Q0 76 12 96" stroke="#8a6a45" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="13" cy="102" r="6" fill="#8a6a45"/>
      <path d="M22 158 Q85 192 148 158" stroke="rgba(255,253,248,0.55)" stroke-width="4"
            fill="none" stroke-dasharray="9 9" stroke-linecap="round"/>
    </g>"""


def envelope(x, y, s=1.0, rot=0, accent=CORAL):
    return f"""
    <g transform="translate({x},{y}) scale({s}) rotate({rot})">
      <rect width="150" height="104" rx="12" fill="#fff" stroke="{LINE}" stroke-width="3"/>
      <path d="M0 14 L75 66 L150 14" fill="none" stroke="{accent}" stroke-width="4" stroke-linecap="round"/>
    </g>"""


def card(title_lines, sub, tag, art, tag_color=CORAL):
    """제목·설명·태그가 있는 표준 카드."""
    ty = 250 - (len(title_lines) - 1) * 40
    titles = "".join(
        f'<text x="470" y="{ty + i * 92}" font-size="72" fill="{INK}" font-family="{BOLD}">{t}</text>'
        for i, t in enumerate(title_lines)
    )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
{BG}
{PETALS}
{art}
{titles}
    <text x="470" y="{ty + len(title_lines) * 92 + 18}" font-size="34" fill="{SOFT}" font-family="{REG}">{sub}</text>
    <g transform="translate(470,{ty + len(title_lines) * 92 + 66})">
      <rect width="{len(tag) * 20 + 56}" height="52" rx="26" fill="none" stroke="{tag_color}" stroke-width="2.5"/>
      <text x="{(len(tag) * 20 + 56) / 2}" y="35" font-size="26" fill="{tag_color}"
            font-family="{REG}" text-anchor="middle" letter-spacing="3">{tag}</text>
    </g>
  </g>
</svg>"""


def home():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
{BG}
{PETALS}
    <path d="M0 470 Q300 380 620 440 Q900 492 1200 410 L1200 630 L0 630 Z" fill="#f7edda"/>
    <path d="M0 520 Q380 452 740 500 Q980 532 1200 490 L1200 630 L0 630 Z" fill="#f1e3cd"/>
    <g transform="translate(690,300) scale(1.5)">
      <rect x="0" y="34" width="120" height="76" rx="6" fill="#fffdf8" stroke="#e6d9c4" stroke-width="2.5"/>
      <path d="M-10 38 L60 -8 L130 38 Z" fill="{CORAL}"/>
      <rect x="88" y="2" width="12" height="30" fill="#c99e73"/>
      <rect x="18" y="54" width="26" height="30" rx="3" fill="#f6c56b"/>
      <rect x="66" y="56" width="24" height="54" rx="3" fill="#c99e73"/>
    </g>
    <g transform="translate(150,300) scale(1.5)">
      <path d="M40 120 Q38 78 30 56" stroke="#b08d63" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="28" cy="42" r="30" fill="#f2d6db"/>
      <circle cx="-2" cy="56" r="21" fill="#eecad1"/>
      <circle cx="56" cy="56" r="19" fill="#f6e0e3"/>
    </g>
    <text x="600" y="180" font-size="86" fill="{INK}" font-family="{BOLD}" text-anchor="middle"
          letter-spacing="14">주머니</text>
    <text x="600" y="248" font-size="34" fill="{SOFT}" font-family="{REG}" text-anchor="middle">이름도 얼굴도 모른 채, 편지로 시작하는 소개팅</text>
    <text x="600" y="600" font-size="24" fill="{SOFT}" font-family="{REG}" text-anchor="middle"
          letter-spacing="8">JUMEONI · A HOUSE OF SLOW THINGS</text>
  </g>
</svg>"""


PAGES = {
    "og-home": home(),
    "og-si": card(
        ["누군가 당신에게", "시 한 편을 건넸어요"],
        "주머니를 열어보세요",
        "건네는 시",
        pouch(140, 200, 1.35),
    ),
    "og-post": card(
        ["이름도 얼굴도 모른 채", "편지로 시작하는 소개팅"],
        "세 통이면 문답이, 일곱 통이면 만남이 열려요",
        "편지 우체국",
        envelope(150, 250, 1.5, -8) + envelope(210, 400, 1.15, 7, LAV),
        LAV,
    ),
    "og-chaek": card(
        ["누군가 당신에게", "책 한 권을 건넸어요"],
        "다 읽은 뒤에야 열리는 봉인 편지가 함께 왔어요",
        "느린 책 교환",
        f"""
    <g transform="translate(150,215) scale(1.5)">
      <rect x="0" y="0" width="150" height="190" rx="8" fill="#5b7a63"/>
      <path d="M12 0 v190" stroke="rgba(255,253,248,0.35)" stroke-width="3"/>
      <rect x="62" y="0" width="26" height="190" fill="rgba(255,253,248,0.28)"/>
      <rect x="0" y="82" width="150" height="26" fill="rgba(255,253,248,0.28)"/>
      <circle cx="75" cy="95" r="26" fill="#c2564a"/>
      <text x="75" y="106" font-size="26" fill="#fff5ef" font-family="{BOLD}" text-anchor="middle">封</text>
    </g>""",
    ),
    "og-map": card(
        ["이 자리에 누군가", "편지를 두고 갔어요"],
        "지나던 사람이 주워 읽고, 대화를 신청해요",
        "편지 지도",
        f"""
    <g transform="translate(175,225) scale(1.5)">
      <path d="M75 0 C34 0 0 33 0 74 C0 129 75 200 75 200 C75 200 150 129 150 74 C150 33 116 0 75 0 Z"
            fill="{CORAL}"/>
      <rect x="36" y="52" width="78" height="54" rx="7" fill="#fffdf8"/>
      <path d="M36 60 L75 88 L114 60" fill="none" stroke="{CORAL}" stroke-width="4" stroke-linecap="round"/>
    </g>""",
    ),
}


def main():
    tmp = tempfile.mkdtemp()
    made = []
    for name, svg in PAGES.items():
        svg_path = os.path.join(tmp, name + ".svg")
        with open(svg_path, "w") as f:
            f.write(svg)
        subprocess.run(["qlmanage", "-t", "-s", "1200", "-o", tmp, svg_path],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
        rendered = svg_path + ".png"
        if not os.path.exists(rendered):
            raise SystemExit(f"렌더 실패: {name}")
        out = os.path.join(ROOT, name + ".png")
        subprocess.run(["sips", "-c", "630", "1200", rendered, "--out", out],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        made.append(f"{name}.png ({os.path.getsize(out) // 1024}KB)")
    shutil.rmtree(tmp, ignore_errors=True)
    print("\n".join(made))


if __name__ == "__main__":
    main()
