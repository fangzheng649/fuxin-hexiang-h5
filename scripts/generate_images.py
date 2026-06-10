"""
抚心合香 H5 — 全前端图片生成（29 张新图）
使用 OpenAI 兼容 API (gpt-image-2 模型)
策略：10 路并发（API 不限流），自动跳过已存在的文件
"""

import requests
import base64
import os
import time
import io
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed

# ============ 配置 ============
API_BASE = "https://api.huiyan-ai.cn"
API_KEY = "sk-5je8Nd4NoxU3UDKSFnFAj5KDlr6sUJ7NNVicu78BgPc5pZZR"
MODEL = "gpt-image-2"
BASE_DIR = r"D:\冷凝合香\fuxin-hexiang-h5\public\images"
MAX_WORKERS = 10      # API 不限流，高并发
REQUEST_TIMEOUT = 300  # 单张超时 5 分钟
JPEG_QUALITY = 85

# ============ 统一风格前缀 ============
STYLE_BASE = (
    "A traditional Chinese incense art photograph, minimalist composition. "
    "Song Dynasty aesthetic, wabi-sabi, artisan craftsmanship. "
    "Soft natural diffused light from the left. Subtle handmade paper texture. "
    "No watermarks, no modern objects. Warm earth tones."
)

# ============ 任务定义 ============
# 每个任务: (output_path, gen_size, thumb_size, prompt)

TASKS = []

# ---------- A. 产品场景图 × 15 ----------
PRODUCTS = [
    {"id": 1,  "name": "竹影清风", "palette": "warm sage green and amber",
     "scene": "bamboo grove shadow falling across aged rice paper, a round incense plaque in the center",
     "herbs": "sandalwood chips, cypress bark, white peony petals, polygala root scattered around"},
    {"id": 2,  "name": "春风拂柳", "palette": "fresh spring green and soft yellow",
     "scene": "willow branches swaying gently, an oval incense plaque with wave patterns",
     "herbs": "bupleurum sprigs, mint leaves, angelica root slices, pink rose petals"},
    {"id": 3,  "name": "听泉水生", "palette": "deep blue-grey and cool silver",
     "scene": "water ripples reflecting moonlight, a round incense plaque with concentric rings",
     "herbs": "polygala root, sour jujube seeds, poria cubes, fleeceflower vine"},
    {"id": 4,  "name": "稻香归田", "palette": "golden ochre and harvest wheat",
     "scene": "rice stalks in autumn field, a square incense plaque with grain texture",
     "herbs": "atractylodes slices, poria chunks, white atractylodes, patchouli leaves"},
    {"id": 5,  "name": "霜菊傲骨", "palette": "silver frost grey and muted bronze",
     "scene": "frost crystals on chrysanthemum petals, an octagonal incense plaque",
     "herbs": "astragalus slices, white chrysanthemum, lily petals, fritillary pieces"},
    {"id": 6,  "name": "二苏旧局", "palette": "deep mahogany and warm amber",
     "scene": "ink wash mountain silhouette in background, a scroll-shaped incense plaque",
     "herbs": "dark agarwood chips, sandalwood shavings, frankincense tears, amber pieces"},
    {"id": 7,  "name": "鹅梨帐香", "palette": "warm peach and honey gold",
     "scene": "pear blossom petals drifting down, a fan-shaped incense plaque with palace lattice",
     "herbs": "dark agarwood, pale sandalwood, patchouli leaves, clove buds"},
    {"id": 8,  "name": "雪中春信", "palette": "icy blue-white and pale jade",
     "scene": "plum blossom on snow-covered branch, a plum-blossom shaped incense plaque",
     "herbs": "pale agarwood, white sandalwood, clove buds, borneol crystals"},
    {"id": 9,  "name": "翠竹幽兰", "palette": "emerald green and jade white",
     "scene": "orchid shadow on bamboo backdrop, a leaf-shaped incense plaque with bamboo grooves",
     "herbs": "cyperus root, pink rose petals, white peony, mint leaves"},
    {"id": 10, "name": "荷风送爽", "palette": "lotus green and fresh aqua",
     "scene": "lotus leaf with morning dew drops, a lotus-pod shaped incense plaque",
     "herbs": "patchouli leaves, perilla leaves, angelica dahurica, tangerine peel curls"},
    {"id": 11, "name": "金菊凝露", "palette": "warm gold and burnt sienna",
     "scene": "golden osmanthus petal rain, a round incense plaque with chrysanthemum relief",
     "herbs": "sandalwood shavings, clove buds, cardamom pods, golden osmanthus"},
    {"id": 12, "name": "松风听涛", "palette": "pine forest green and deep moss",
     "scene": "pine needles and ocean wave shadow, a pinecone-shaped incense plaque",
     "herbs": "platycodon root, apricot kernels, dried lily, mint leaves"},
    {"id": 13, "name": "闻思静心", "palette": "silver grey and ink black with white accents",
     "scene": "book scroll silhouette, a book-shaped incense plaque with cloud pattern",
     "herbs": "sandalwood chips, cyperus root, scrophularia, clove buds"},
    {"id": 14, "name": "梅雪争春", "palette": "midnight blue and dark jade with silver",
     "scene": "plum branch against winter moon, a crescent-shaped incense plaque",
     "herbs": "rehmannia root, cornus fruit, yam slices, red schisandra berries"},
    {"id": 15, "name": "碧潭秋月", "palette": "teal and deep ocean blue with moonlight silver",
     "scene": "moon reflection on still water, a full moon shaped incense plaque",
     "herbs": "sour jujube seeds, polygala root, ophiopogon tuber, arborvitae seeds"},
]

for p in PRODUCTS:
    prompt = (
        f"{STYLE_BASE} Landscape orientation, wide panoramic scene. "
        f"Left 60%: {p['scene']}, with {p['herbs']}. "
        f"Right 40%: elegant empty space with faint ink wash texture. "
        f'Chinese calligraphy "{p["name"]}" written vertically in elegant running script, '
        f"positioned in the right area, appearing as if written with brush and ink on rice paper. "
        f"Color palette: {p['palette']}. "
        f"Bottom 20% slightly darker for text overlay readability."
    )
    TASKS.append({
        "name": f"scene-{p['id']}",
        "path": os.path.join(BASE_DIR, "products", f"scene-{p['id']}.jpg"),
        "gen_size": "1792x1024",
        "thumb": (1792, 1024),
        "prompt": prompt,
    })

# ---------- B. 首页 Hero ----------
TASKS.append({
    "name": "home-hero",
    "path": os.path.join(BASE_DIR, "hero", "home-hero.jpg"),
    "gen_size": "1792x1024",
    "thumb": (1792, 1024),
    "prompt": (
        f"{STYLE_BASE} Panoramic landscape overhead photograph of a traditional Chinese incense workshop. "
        "An aged wooden workbench covered with handmade rice paper. "
        "Scattered dried herbs, wooden tools, half-finished incense plaques, a stone mortar and pestle. "
        "Warm amber light filtering through a bamboo window from the left. "
        'Chinese calligraphy "抚心合香" written vertically in elegant seal script, '
        "appearing as a red seal stamp impression in the upper right area. "
        'Below it, smaller running script "以香入药 以心疗心". '
        "Warm golden brown tones. Bottom area slightly darker for overlay text readability."
    ),
})

# ---------- C. 非遗 Hero ----------
TASKS.append({
    "name": "heritage-hero",
    "path": os.path.join(BASE_DIR, "hero", "heritage-hero.jpg"),
    "gen_size": "1792x1024",
    "thumb": (1792, 1024),
    "prompt": (
        f"{STYLE_BASE} Close-up photograph of traditional Chinese incense making craft, landscape orientation. "
        "Two hands skillfully kneading incense paste on a stone surface. "
        "Surrounding: bamboo steamers, copper sieve, dried herbs, nine-stage processing tools. "
        "Dark moody lighting, deep brown and forest green tones, vignette edges. "
        'Chinese calligraphy "冷凝合香制作技艺" written vertically in bold regular script on the right side, '
        "as if inscribed on the workshop wall. "
        'A red circular seal stamp reading "非遗 福州" in the upper right corner. '
        "Documentary photography style. Bottom slightly darker."
    ),
})

# ---------- D. 传承人手记封面 × 4 ----------
NOTES = [
    {"id": 1, "prompt": (
        f"{STYLE_BASE} A traditional Chinese letter writing scene. "
        "An unfolded letter on aged rice paper, placed on a woven bamboo mat. "
        "Bamboo leaves and sandalwood chips scattered around the edges. "
        'Chinese calligraphy "竹影清风来信" written on the letter paper in elegant running script. '
        "Warm amber light, intimate and personal atmosphere."
    )},
    {"id": 2, "prompt": (
        f"{STYLE_BASE} Traditional Chinese herb processing scene. "
        "Bamboo steamers stacked with steam rising, herbs drying on flat bamboo trays in sunlight. "
        "Rich golden sunlight hitting the herbs, warm earth tones. "
        'Chinese calligraphy "九蒸九晒" written vertically on the side in brush and ink. '
        "Artisan craftsmanship, documentary style."
    )},
    {"id": 3, "prompt": (
        f"{STYLE_BASE} A craftsman experimental workspace scene. "
        "Translucent incense paste in porcelain bowls, droppers, mixing tools on a wooden table. "
        "Various colored paste samples in small dishes, creative experimentation feel. "
        'Chinese calligraphy "漆香新试" written in elegant running script on a paper label. '
        "Warm amber and brown tones."
    )},
    {"id": 4, "prompt": (
        f"{STYLE_BASE} A traditional Chinese herb study scene. "
        "Close-up of dried polygala root with an open ancient herb book. "
        "Faint mountain landscape silhouette in the background. "
        'Chinese calligraphy "远志" written in bold regular script with brush and ink. '
        "Cool blue-grey tones, scholarly atmosphere."
    )},
]

for n in NOTES:
    TASKS.append({
        "name": f"note-{n['id']}",
        "path": os.path.join(BASE_DIR, "notes", f"note-{n['id']}.jpg"),
        "gen_size": "1024x576",
        "thumb": (1024, 576),
        "prompt": n["prompt"],
    })

# ---------- E. 视频缩略图 × 4 ----------
VIDEOS = [
    {"id": 1, "prompt": (
        f"{STYLE_BASE} Panoramic interior of a traditional Chinese incense workshop museum, landscape. "
        "Antique tools displayed on wooden shelves, historical artifacts, aged patina. "
        'Chinese calligraphy "冷凝合香的起源" written as a title card in the scene. '
        "Dark atmospheric lighting, warm spotlights, documentary cinematography style."
    )},
    {"id": 2, "prompt": (
        f"{STYLE_BASE} Traditional Chinese herb steaming process, landscape orientation. "
        "Stacked bamboo steamers with steam billowing out, herbs spread on bamboo trays beside them. "
        "Rich warm lighting, golden steam catching the light. "
        'Chinese calligraphy "九蒸九晒" as a vertical inscription on the left side.'
    )},
    {"id": 3, "prompt": (
        f"{STYLE_BASE} Top-down view of incense plaque making stages, landscape orientation. "
        "Materials progressing from raw herbs to powder to paste to finished plaque, "
        "arranged left to right in chronological order. "
        'Chinese calligraphy "一方香牌的诞生" as a title at the top. '
        "Clean composition, warm tones."
    )},
    {"id": 4, "prompt": (
        f"{STYLE_BASE} Five elements arrangement with corresponding herbs, landscape orientation. "
        "Five clusters of herbs arranged in a circle: wood/green, fire/red, earth/yellow, metal/white, water/blue-black. "
        'Chinese calligraphy "五行与香" written in the center in elegant seal script. '
        "Classical ink wash style mixed with herb photography."
    )},
]

for v in VIDEOS:
    TASKS.append({
        "name": f"video-{v['id']}",
        "path": os.path.join(BASE_DIR, "videos", f"video-{v['id']}.jpg"),
        "gen_size": "1024x576",
        "thumb": (1024, 576),
        "prompt": v["prompt"],
    })

# ---------- F. 香礼礼盒 × 2 ----------
TASKS.append({
    "name": "gift-1",
    "path": os.path.join(BASE_DIR, "gifts", "gift-1.jpg"),
    "gen_size": "1024x576",
    "thumb": (1024, 576),
    "prompt": (
        f"{STYLE_BASE} A premium Chinese gift box opened to reveal four incense plaques, landscape. "
        "Elegant dark wood box with gold-embossed Chinese characters '四季安宁' on the lid. "
        "Four small round plaques arranged on a silk cushion inside the box. "
        "Rich burgundy and gold tones, luxury packaging photography."
    ),
})
TASKS.append({
    "name": "gift-2",
    "path": os.path.join(BASE_DIR, "gifts", "gift-2.jpg"),
    "gen_size": "1024x576",
    "thumb": (1024, 576),
    "prompt": (
        f"{STYLE_BASE} A premium Chinese gift box opened to reveal five incense plaques in five colors, landscape. "
        "Dark lacquer box with gold-embossed Chinese characters '五行调和' on the lid. "
        "Five colored plaques (green, red, yellow, white, blue-black) arranged on silk. "
        "Deep teal and gold tones, luxury packaging photography."
    ),
})

# ---------- G. 工坊 Banner ----------
TASKS.append({
    "name": "workshop-banner",
    "path": os.path.join(BASE_DIR, "hero", "workshop-banner.jpg"),
    "gen_size": "1792x1024",
    "thumb": (1792, 1024),
    "prompt": (
        f"{STYLE_BASE} The entrance of a traditional Chinese incense workshop in Fuzhou, landscape. "
        "Wooden door frame, bamboo curtain, warm lantern light glowing from inside. "
        "Scattered herbs on the stone doorstep, a welcoming atmosphere. "
        'Chinese calligraphy "桐南村工坊" written as a wooden signboard above the door. '
        "Warm amber and brown tones. Bottom area darker for button overlay."
    ),
})

# ---------- H. 配香游戏卡 ----------
TASKS.append({
    "name": "game-card",
    "path": os.path.join(BASE_DIR, "hero", "game-card.jpg"),
    "gen_size": "1792x1024",
    "thumb": (1792, 1024),
    "prompt": (
        f"{STYLE_BASE} A playful traditional Chinese herb-blending scene, landscape. "
        "An antique prescription paper with brush-written herb names and 君臣佐使 annotations. "
        "Small dishes of colorful herbs arranged around the paper, some herbs scattered playfully. "
        'Chinese calligraphy "配香游戏" written as a fun banner at the top in running script. '
        "Jade green and cream white tones, inviting and interactive feel."
    ),
})


# ============ 生成函数 ============
def generate_one(task):
    """生成单张图片（线程安全）"""
    name = task["name"]
    filepath = task["path"]
    prompt = task["prompt"]
    gen_size = task["gen_size"]
    thumb = task["thumb"]

    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    # 跳过已存在的有效文件
    if os.path.exists(filepath):
        fsize = os.path.getsize(filepath)
        if fsize > 5000:
            return {"name": name, "status": "skipped", "size": fsize}

    try:
        resp = requests.post(
            f"{API_BASE}/v1/images/generations",
            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
            json={"model": MODEL, "prompt": prompt, "n": 1, "size": gen_size},
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()

        if "data" not in data or len(data["data"]) == 0:
            return {"name": name, "status": "error", "error": "empty data"}

        item = data["data"][0]
        if "b64_json" not in item:
            return {"name": name, "status": "error", "error": "no b64_json"}

        # 解码 + 压缩
        img_data = base64.b64decode(item["b64_json"])
        img = Image.open(io.BytesIO(img_data))
        if img.mode == "RGBA":
            img = img.convert("RGB")
        img.thumbnail(thumb, Image.LANCZOS)
        img.save(filepath, "JPEG", quality=JPEG_QUALITY, optimize=True)
        fsize = os.path.getsize(filepath)

        return {"name": name, "status": "ok", "size": fsize}

    except Exception as e:
        return {"name": name, "status": "error", "error": str(e)[:120]}


def main():
    print("=" * 60)
    print(f"抚心合香 -- 全前端图片生成")
    print(f"API: {API_BASE}  Model: {MODEL}")
    print(f"Workers: {MAX_WORKERS}  Total: {len(TASKS)}")
    print("=" * 60)

    # 分组显示
    groups = {
        "Product scenes": [t for t in TASKS if t["name"].startswith("scene-")],
        "Hero banners": [t for t in TASKS if "hero" in t["name"]],
        "Note covers": [t for t in TASKS if t["name"].startswith("note-")],
        "Video thumbs": [t for t in TASKS if t["name"].startswith("video-")],
        "Gift boxes": [t for t in TASKS if t["name"].startswith("gift-")],
        "Game card": [t for t in TASKS if t["name"] == "game-card"],
        "Workshop": [t for t in TASKS if t["name"] == "workshop-banner"],
    }
    for g, items in groups.items():
        if items:
            print(f"  {g}: {len(items)}")

    start = time.time()
    results = []

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(generate_one, t): t for t in TASKS}
        for future in as_completed(futures):
            r = future.result()
            results.append(r)
            icon = {"ok": "[OK]", "skipped": "[SKIP]", "error": "[ERR]"}[r["status"]]
            if r["status"] == "ok":
                print(f"  {icon} {r['name']}: {r['size']//1024}KB")
            elif r["status"] == "skipped":
                print(f"  {icon} {r['name']}: exists ({r['size']//1024}KB)")
            else:
                print(f"  {icon} {r['name']}: {r.get('error', 'unknown')}")

    elapsed = time.time() - start
    ok = sum(1 for r in results if r["status"] == "ok")
    skipped = sum(1 for r in results if r["status"] == "skipped")
    err = sum(1 for r in results if r["status"] == "error")

    print(f"\n{'='*60}")
    print(f"Done! New: {ok}, Skipped: {skipped}, Failed: {err}")
    print(f"Time: {elapsed:.0f}s ({elapsed/60:.1f}min)")
    if err:
        failed = [r["name"] for r in results if r["status"] == "error"]
        print(f"Failed: {', '.join(failed)}")
        print("Re-run script to retry failed images")
    print("=" * 60)


if __name__ == "__main__":
    main()
