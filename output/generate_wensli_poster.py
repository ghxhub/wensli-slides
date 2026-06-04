from pathlib import Path
from math import sin, pi

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "posters" / "wensli-ai-guide-poster-v2.png"

W, H = 864, 1821
IVORY = (247, 242, 234)
PAPER = (255, 252, 246)
NAVY = (15, 25, 44)
TEAL = (18, 92, 96)
DARK_TEAL = (0, 66, 70)
GOLD = (181, 137, 78)
SOFT_GOLD = (207, 180, 134)
INK = (29, 36, 50)
MUTED = (96, 104, 118)
LINE = (225, 211, 190)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


FONT_SERIF = "C:/Windows/Fonts/NotoSerifSC-VF.ttf"
FONT_SANS = "C:/Windows/Fonts/NotoSansSC-VF.ttf"
FONT_SANS_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
FONT_LATIN = "C:/Windows/Fonts/Georgia.ttf"

serif_78 = font(FONT_SERIF, 78)
serif_68 = font(FONT_SERIF, 68)
serif_58 = font(FONT_SERIF, 58)
serif_54 = font(FONT_SERIF, 54)
serif_44 = font(FONT_SERIF, 44)
serif_34 = font(FONT_SERIF, 34)
sans_30 = font(FONT_SANS_BOLD, 30)
sans_28 = font(FONT_SANS_BOLD, 28)
sans_24 = font(FONT_SANS_BOLD, 24)
sans_22 = font(FONT_SANS, 22)
sans_20 = font(FONT_SANS, 20)
sans_18 = font(FONT_SANS, 18)
sans_16 = font(FONT_SANS, 16)
sans_15 = font(FONT_SANS, 15)
latin_34 = font(FONT_LATIN, 34)
latin_22 = font(FONT_LATIN, 22)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_centered(draw, text, center_x, y, fnt, fill):
    tw, _ = text_size(draw, text, fnt)
    draw.text((center_x - tw / 2, y), text, font=fnt, fill=fill)


def rounded_shadow(draw_target, xy, radius, fill, outline=None, shadow=(0, 0, 0, 32), offset=(0, 14), blur=18):
    x0, y0, x1, y1 = xy
    shadow_layer = Image.new("RGBA", draw_target.size, (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_layer)
    sdraw.rounded_rectangle((x0 + offset[0], y0 + offset[1], x1 + offset[0], y1 + offset[1]), radius, fill=shadow)
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(blur))
    draw_target.alpha_composite(shadow_layer)
    d = ImageDraw.Draw(draw_target)
    d.rounded_rectangle(xy, radius, fill=fill, outline=outline, width=1 if outline else 0)


def crop_alpha(img: Image.Image) -> Image.Image:
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def fit_width(img: Image.Image, width: int) -> Image.Image:
    ratio = width / img.width
    return img.resize((width, int(img.height * ratio)), Image.Resampling.LANCZOS)


def paste_with_shadow(base: Image.Image, img: Image.Image, x: int, y: int, shadow_alpha=58, blur=22, dx=12, dy=18):
    img = crop_alpha(img)
    alpha = img.getchannel("A")
    shadow = Image.new("RGBA", img.size, (0, 0, 0, shadow_alpha))
    shadow.putalpha(alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(shadow, (x + dx, y + dy))
    base.alpha_composite(img, (x, y))


def draw_icon_circle(draw, cx, cy, label, fill=TEAL):
    draw.ellipse((cx - 31, cy - 31, cx + 31, cy + 31), fill=fill)
    if label == "robot":
        draw.rounded_rectangle((cx - 17, cy - 10, cx + 17, cy + 14), 6, outline=(255, 255, 255), width=3)
        draw.line((cx, cy - 18, cx, cy - 10), fill=(255, 255, 255), width=3)
        draw.ellipse((cx - 4, cy - 24, cx + 4, cy - 16), outline=(255, 255, 255), width=3)
        draw.ellipse((cx - 10, cy - 2, cx - 5, cy + 3), fill=(255, 255, 255))
        draw.ellipse((cx + 5, cy - 2, cx + 10, cy + 3), fill=(255, 255, 255))
        draw.arc((cx - 9, cy + 1, cx + 9, cy + 12), 20, 160, fill=(255, 255, 255), width=2)
    elif label == "share":
        pts = [(cx - 13, cy + 10), (cx + 13, cy - 12), (cx + 15, cy + 14)]
        draw.line((pts[0][0], pts[0][1], pts[1][0], pts[1][1]), fill=(255, 255, 255), width=4)
        draw.line((pts[0][0], pts[0][1], pts[2][0], pts[2][1]), fill=(255, 255, 255), width=4)
        for px, py in pts:
            draw.ellipse((px - 7, py - 7, px + 7, py + 7), fill=(255, 255, 255))
    elif label == "file":
        draw.rectangle((cx - 13, cy - 16, cx + 10, cy + 17), outline=(255, 255, 255), width=3)
        draw.line((cx + 1, cy - 16, cx + 10, cy - 7), fill=(255, 255, 255), width=3)
        draw.line((cx - 6, cy + 2, cx + 6, cy + 2), fill=(255, 255, 255), width=3)
        draw.line((cx - 6, cy + 10, cx + 6, cy + 10), fill=(255, 255, 255), width=3)
    elif label == "heart":
        draw.text((cx - 16, cy - 25), "♥", font=font(FONT_SANS, 43), fill=(255, 255, 255))
    else:
        draw.rounded_rectangle((cx - 14, cy - 16, cx + 14, cy + 18), 5, outline=(255, 255, 255), width=3)
        draw.arc((cx - 9, cy - 25, cx + 9, cy - 3), 180, 360, fill=(255, 255, 255), width=3)


def build_background():
    old = Image.open(ROOT / "output" / "posters" / "silk-ai-guide-poster-v1.png").convert("RGB")
    bg = ImageOps.fit(old, (W, H), method=Image.Resampling.LANCZOS)
    bg = bg.filter(ImageFilter.GaussianBlur(30))
    bg = ImageEnhance.Color(bg).enhance(0.35)
    bg = Image.blend(bg, Image.new("RGB", (W, H), IVORY), 0.78).convert("RGBA")

    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i, (y, amp, col, width) in enumerate(
        [
            (392, 34, (197, 154, 96, 75), 18),
            (438, 26, (231, 204, 160, 58), 13),
            (522, 22, (21, 105, 108, 28), 10),
            (1528, 26, (198, 158, 99, 35), 10),
        ]
    ):
        pts = []
        for x in range(-80, W + 81, 12):
            yy = y + sin((x / W) * 2 * pi + i * 0.8) * amp
            pts.append((x, yy))
        d.line(pts, fill=col, width=width, joint="curve")
    return Image.alpha_composite(bg, layer)


def preprocess_share_card(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    d = ImageDraw.Draw(img)
    # Replace the visible uppercase English brand in the share-card screenshot.
    d.rounded_rectangle((225, 205, 432, 256), radius=3, fill=(42, 50, 66, 255))
    draw_centered(d, "wensli", 328, 207, font(FONT_LATIN, 42), (213, 185, 106, 255))
    return img


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas = build_background()
    draw = ImageDraw.Draw(canvas)

    # Header brand
    draw.line((48, 76, 78, 42, 108, 76, 78, 110, 48, 76), fill=GOLD, width=2)
    draw.ellipse((56, 54, 100, 98), outline=GOLD, width=2)
    draw.text((124, 52), "wensli", font=latin_34, fill=NAVY)
    draw.text((126, 91), "丝绸东方", font=sans_18, fill=(75, 82, 94))

    # Hero headline
    draw.text((48, 150), "丝绸品牌", font=serif_68, fill=NAVY)
    draw.text((48, 235), "AI", font=serif_68, fill=GOLD)
    draw.text((138, 242), "智能导购", font=serif_58, fill=NAVY)
    draw.text((48, 314), "导出分享小程序", font=serif_54, fill=NAVY)
    draw.text((51, 392), "智能推荐 · 高效选品 · 导出分享 · 专业服务", font=sans_20, fill=(69, 75, 88))
    draw.line((50, 436, 188, 436), fill=GOLD, width=2)
    draw.ellipse((185, 430, 197, 442), fill=SOFT_GOLD)

    # Main AI guide phone
    ai_phone = fit_width(Image.open(ROOT / "public" / "training" / "智能导购界面.png").convert("RGBA"), 322)
    paste_with_shadow(canvas, ai_phone, 501, 64, shadow_alpha=74, blur=24, dx=13, dy=20)
    rounded_shadow(canvas, (523, 717, 814, 772), 27, (255, 252, 246, 238), outline=(222, 207, 184, 210), shadow=(0, 0, 0, 25), offset=(0, 8), blur=12)
    draw = ImageDraw.Draw(canvas)
    draw_centered(draw, "AI智能导购界面", 668, 731, sans_24, TEAL)

    # Two-key focus card
    rounded_shadow(canvas, (44, 462, 428, 734), 18, (255, 252, 246, 232), outline=(220, 205, 183, 210))
    draw = ImageDraw.Draw(canvas)
    draw.text((78, 495), "两大重点", font=serif_34, fill=NAVY)
    draw.line((78, 545, 386, 545), fill=(219, 204, 182), width=1)
    draw_icon_circle(draw, 96, 594, "robot")
    draw.text((143, 568), "AI智能导购", font=sans_28, fill=INK)
    draw.text((144, 607), "输入需求，即刻生成选品建议", font=sans_18, fill=MUTED)
    draw_icon_circle(draw, 96, 674, "share", fill=DARK_TEAL)
    draw.text((143, 649), "导出分享", font=sans_28, fill=INK)
    draw.text((144, 688), "文件、收藏夹、分享卡一键交付", font=sans_18, fill=MUTED)

    # Workflow section
    rounded_shadow(canvas, (40, 820, 824, 1364), 20, (255, 252, 246, 236), outline=(221, 205, 180, 230))
    draw = ImageDraw.Draw(canvas)
    draw.text((74, 850), "导出分享重点", font=serif_44, fill=NAVY)
    draw.text((75, 908), "文件助手、收藏夹导出、分享卡结果页，串联客户沟通与交付", font=sans_20, fill=(89, 96, 109))

    phone_specs = [
        ("文件助手导出", ROOT / "public" / "training" / "文件助手导出.png"),
        ("收藏夹导出", ROOT / "public" / "training" / "收藏夹导出.png"),
        ("分享卡结果页", ROOT / "public" / "training" / "分享卡导出显示.png"),
    ]
    x_positions = [84, 350, 616]
    for idx, ((label, path), x) in enumerate(zip(phone_specs, x_positions)):
        img = preprocess_share_card(path) if idx == 2 else Image.open(path).convert("RGBA")
        img = fit_width(img, 165)
        paste_with_shadow(canvas, img, x, 944, shadow_alpha=52, blur=18, dx=8, dy=14)
        draw = ImageDraw.Draw(canvas)
        draw_centered(draw, label, x + 82, 1308, sans_22, INK)
        draw.rounded_rectangle((x + 20, 1336, x + 145, 1340), 2, fill=SOFT_GOLD)
    draw = ImageDraw.Draw(canvas)
    for ax in [276, 542]:
        draw.line((ax, 1128, ax + 34, 1128), fill=(166, 182, 185), width=3)
        draw.polygon([(ax + 34, 1128), (ax + 23, 1119), (ax + 23, 1137)], fill=(166, 182, 185))

    # Process card
    rounded_shadow(canvas, (48, 1384, 816, 1568), 18, (255, 252, 246, 232), outline=(221, 205, 180, 220), shadow=(0, 0, 0, 24), offset=(0, 8), blur=14)
    draw = ImageDraw.Draw(canvas)
    draw.text((78, 1410), "使用流程", font=serif_34, fill=NAVY)
    steps = [
        ("bag", "浏览商品", "沉浸选品"),
        ("robot", "AI推荐", "匹配需求"),
        ("heart", "收藏加购", "统一管理"),
        ("share", "导出分享", "触达客户"),
    ]
    centers = [164, 344, 524, 704]
    for i, (icon, title, sub) in enumerate(steps):
        draw_icon_circle(draw, centers[i], 1468, icon, fill=TEAL if i != 2 else (238, 230, 218))
        if i == 2:
            draw.text((centers[i] - 16, 1443), "♥", font=font(FONT_SANS, 43), fill=TEAL)
        draw_centered(draw, title, centers[i], 1510, sans_20, INK)
        draw_centered(draw, sub, centers[i], 1537, sans_16, MUTED)
        if i < len(centers) - 1:
            draw.line((centers[i] + 48, 1468, centers[i + 1] - 48, 1468), fill=(160, 178, 180), width=3)
            draw.polygon([(centers[i + 1] - 48, 1468), (centers[i + 1] - 60, 1459), (centers[i + 1] - 60, 1477)], fill=(160, 178, 180))

    # Value card
    rounded_shadow(canvas, (48, 1582, 816, 1728), 18, (255, 252, 246, 232), outline=(221, 205, 180, 220), shadow=(0, 0, 0, 20), offset=(0, 8), blur=12)
    draw = ImageDraw.Draw(canvas)
    draw.text((78, 1608), "核心价值", font=serif_34, fill=NAVY)
    values = [
        ("提升转化", "AI精准推荐，减少沟通成本"),
        ("优化选品", "多场景筛选，快速定位商品"),
        ("沉淀偏好", "收藏夹记录客户需求"),
        ("强化传播", "分享卡与文件便捷交付"),
    ]
    value_centers = [245, 420, 595, 750]
    for i, (title, sub) in enumerate(values):
        x = value_centers[i]
        if i > 0:
            draw.line((x - 78, 1632, x - 78, 1708), fill=(224, 210, 190), width=1)
        draw_centered(draw, title, x, 1658, sans_20, INK)
        draw_centered(draw, sub, x, 1690, sans_15, MUTED)
        draw.ellipse((x - 19, 1624, x + 19, 1662), outline=GOLD, width=2)
        draw.line((x - 9, 1645, x - 2, 1652, x + 12, 1635), fill=GOLD, width=3)

    # Bottom silk band with brand
    band = Image.new("RGBA", (W, 110), (0, 0, 0, 0))
    bd = ImageDraw.Draw(band)
    bd.rectangle((0, 20, W, 110), fill=(0, 63, 68, 255))
    for j, color in enumerate([(6, 78, 80, 255), (0, 54, 61, 255), (16, 94, 94, 220)]):
        pts = [(0, 48 + j * 10)]
        for x in range(0, W + 1, 18):
            pts.append((x, 36 + j * 18 + sin(x / 92 + j) * 16))
        pts.extend([(W, 110), (0, 110)])
        bd.polygon(pts, fill=color)
    bd.line([(0, 48 + sin(x / 80) * 10) for x in range(0, W + 1, 12)], fill=(203, 165, 95, 180), width=2)
    canvas.alpha_composite(band, (0, 1711))
    draw = ImageDraw.Draw(canvas)
    draw.text((78, 1758), "wensli", font=latin_34, fill=(255, 246, 226))
    draw.text((76, 1793), "让世界爱上中国丝绸之美", font=sans_18, fill=(218, 183, 113))
    draw.text((494, 1762), "AI智能导购 · 导出分享 · 高效交付", font=sans_20, fill=(232, 216, 184))

    canvas.convert("RGB").save(OUT, quality=96)
    print(OUT)


if __name__ == "__main__":
    main()
