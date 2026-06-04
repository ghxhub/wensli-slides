from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
POSTER_DIR = ROOT / "output" / "poster"

FONT_DIR = Path(r"C:\Windows\Fonts")
MSYH = str(FONT_DIR / "msyh.ttc")
MSYH_BOLD = str(FONT_DIR / "msyhbd.ttc")
CAMBRIA_BOLD = str(FONT_DIR / "cambriab.ttf")
CAMBRIA = str(FONT_DIR / "cambria.ttc")


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_blurred_overlay(
    img: Image.Image,
    box: tuple[int, int, int, int],
    color: tuple[int, int, int],
    alpha: int,
    radius: int = 24,
) -> None:
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    mask = Image.new("L", img.size, 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.rectangle(box, fill=alpha)
    mask = mask.filter(ImageFilter.GaussianBlur(radius))
    fill = Image.new("RGBA", img.size, (*color, 255))
    overlay = Image.composite(fill, overlay, mask)
    img.alpha_composite(overlay)


def draw_vertical_fade(
    img: Image.Image,
    box: tuple[int, int, int, int],
    color: tuple[int, int, int],
    alpha_top: int,
    alpha_bottom: int,
) -> None:
    x0, y0, x1, y1 = box
    width = x1 - x0
    height = y1 - y0
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(height):
        t = y / max(1, height - 1)
        alpha = round(alpha_top * (1 - t) + alpha_bottom * t)
        od.line([(0, y), (width, y)], fill=(*color, alpha))
    img.alpha_composite(overlay, (x0, y0))


def draw_horizontal_fade(
    img: Image.Image,
    box: tuple[int, int, int, int],
    color: tuple[int, int, int],
    alpha_left: int,
    alpha_right: int,
) -> None:
    x0, y0, x1, y1 = box
    width = x1 - x0
    height = y1 - y0
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for x in range(width):
        t = x / max(1, width - 1)
        alpha = round(alpha_left * (1 - t) + alpha_right * t)
        od.line([(x, 0), (x, height)], fill=(*color, alpha))
    img.alpha_composite(overlay, (x0, y0))


def wrap_text(text: str, draw: ImageDraw.ImageDraw, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for ch in text:
        candidate = current + ch
        if ch == "\n":
            if current:
                lines.append(current)
            current = ""
            continue
        width, _ = text_size(draw, candidate, fnt)
        if width <= max_width or not current:
            current = candidate
        else:
            lines.append(current.rstrip())
            current = ch.lstrip()
    if current:
        lines.append(current.rstrip())
    return lines


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    max_width: int,
    line_gap: int,
) -> int:
    x, y = xy
    lines = wrap_text(text, draw, fnt, max_width)
    line_h = text_size(draw, "国", fnt)[1] + line_gap
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_h
    return y


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int,
    fill: tuple[int, int, int, int] | None = None,
    outline: tuple[int, int, int, int] | None = None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
) -> None:
    w, h = text_size(draw, text, fnt)
    x0, y0, x1, y1 = box
    draw.text((x0 + (x1 - x0 - w) / 2, y0 + (y1 - y0 - h) / 2 - 2), text, font=fnt, fill=fill)


def refine_dark() -> None:
    src = POSTER_DIR / "siyu-lixuan-poster-dark-kv.png"
    dst = POSTER_DIR / "siyu-lixuan-poster-dark-kv-layout-v2.png"
    img = Image.open(src).convert("RGBA")
    draw = ImageDraw.Draw(img)

    deep = (2, 49, 44)
    deeper = (1, 42, 38)
    gold = (245, 211, 154)
    gold_dim = (205, 164, 92)
    cream = (246, 239, 217)
    muted = (185, 205, 196)

    # Build a clean text-safe zone over the previous crowded copy.
    draw.rectangle((0, 0, 556, 1024), fill=(*deep, 255))
    draw_horizontal_fade(img, (556, 0, 735, 1024), deep, 255, 0)
    draw_blurred_overlay(img, (42, 62, 548, 668), deeper, 72, 28)
    draw_blurred_overlay(img, (44, 696, 530, 902), deeper, 64, 24)
    draw_blurred_overlay(img, (40, 900, 985, 998), deeper, 108, 18)
    draw = ImageDraw.Draw(img)

    ai_font = font(CAMBRIA_BOLD, 92)
    title_font = font(MSYH_BOLD, 64)
    subtitle_font = font(MSYH_BOLD, 34)
    brand_font = font(MSYH, 44)
    small_font = font(MSYH, 24)
    body_font = font(MSYH, 26)
    card_title = font(MSYH_BOLD, 31)
    card_sub = font(MSYH, 18)
    feature_title = font(MSYH_BOLD, 25)
    feature_sub = font(MSYH, 17)
    row_title = font(MSYH_BOLD, 19)
    row_sub = font(MSYH, 13)

    x = 66
    draw.text((x, 82), "丝语礼选", font=brand_font, fill=gold)
    draw.line((x, 135, x + 204, 135), fill=gold_dim, width=2)
    draw.text((x, 168), "AI 驱动的丝巾礼赠顾问", font=small_font, fill=muted)

    title_y = 254
    draw.text((x, title_y), "AI", font=ai_font, fill=gold)
    draw.text((x + 126, title_y + 19), "智能导购", font=title_font, fill=gold)
    draw.text((x, 352), "一键导出图文版 PPT", font=subtitle_font, fill=cream)
    draw.line((x, 408, x + 424, 408), fill=gold_dim, width=2)

    body = "面向丝巾、礼盒与商务赠礼场景，把 AI 推荐、商品筛选与方案导出，串成更顺手的客户沟通。"
    draw_wrapped(draw, (x, 452), body, body_font, muted, 438, 14)

    card = (x, 574, x + 448, 656)
    rounded_rect(draw, card, 18, fill=(4, 61, 55, 205), outline=(*gold, 235), width=2)
    icon_box = (x + 26, 596, x + 57, 628)
    rounded_rect(draw, icon_box, 2, outline=(*gold, 255), width=2)
    draw.text((x + 31, 601), "PPT", font=font(MSYH_BOLD, 10), fill=gold)
    draw.line((x + 26, 592, x + 49, 592), fill=gold, width=2)
    draw.text((x + 80, 592), "PPT 文案导出", font=card_title, fill=gold)
    draw.text((x + 82, 630), "卖点生成 / 商品搭配 / 演示内容", font=card_sub, fill=muted)

    features = [
        ("AI 对话推荐", "按预算、场景与人群给建议"),
        ("礼品智能筛选", "丝巾、礼盒、配饰一站式匹配"),
        ("分享跟进", "方案导出后继续推进转化"),
    ]
    y = 716
    for i, (title, sub) in enumerate(features):
        iy = y + i * 62
        draw.ellipse((x + 4, iy + 6, x + 18, iy + 20), fill=gold)
        draw.line((x + 28, iy + 13, x + 36, iy + 13), fill=gold, width=2)
        draw.text((x + 48, iy - 5), title, font=feature_title, fill=cream)
        draw.text((x + 50, iy + 28), sub, font=feature_sub, fill=muted)

    row = (58, 914, 966, 984)
    rounded_rect(draw, row, 22, fill=(3, 58, 52, 224), outline=(*gold, 230), width=1)
    row_items = [
        ("时尚配饰全品类", "围巾 / 丝巾 / 配饰"),
        ("数据驱动选品", "洞察趋势 提升转化"),
        ("场景化营销", "精准表达 商务赠礼"),
        ("专属智能助手", "懂时尚 更懂生意"),
    ]
    cell_w = (row[2] - row[0]) // 4
    for i, (title, sub) in enumerate(row_items):
        cx = row[0] + i * cell_w
        if i:
            draw.line((cx, row[1] + 15, cx, row[3] - 15), fill=(207, 171, 102, 115), width=1)
        draw_centered_text(draw, (cx + 6, row[1] + 14, cx + cell_w - 6, row[1] + 39), title, row_title, cream)
        draw_centered_text(draw, (cx + 6, row[1] + 42, cx + cell_w - 6, row[1] + 64), sub, row_sub, muted)

    img.convert("RGB").save(dst, quality=95)


def refine_light() -> None:
    src = POSTER_DIR / "siyu-lixuan-poster-light-elegant.png"
    dst = POSTER_DIR / "siyu-lixuan-poster-light-elegant-layout-v2.png"
    img = Image.open(src).convert("RGBA")
    draw = ImageDraw.Draw(img)

    ivory = (250, 246, 235)
    ivory_warm = (248, 241, 225)
    navy = (22, 35, 59)
    gold = (193, 143, 70)
    gold_light = (214, 169, 95)
    body = (80, 82, 82)

    # Keep the scarf intact while rebuilding the text zones cleanly.
    draw.rectangle((0, 0, 602, 690), fill=(*ivory, 255))
    draw_horizontal_fade(img, (602, 0, 735, 690), ivory, 255, 0)
    draw_vertical_fade(img, (0, 1180, 941, 1672), ivory_warm, 255, 252)
    draw = ImageDraw.Draw(img)

    brand_en = font(CAMBRIA_BOLD, 38)
    brand_cn = font(MSYH, 22)
    title_ai = font(CAMBRIA_BOLD, 112)
    title_cn = font(MSYH_BOLD, 70)
    subtitle = font(MSYH_BOLD, 44)
    copy_font = font(MSYH, 28)
    feature_font = font(MSYH, 23)
    small_font = font(MSYH, 15)

    x = 58
    draw.text((x, 82), "WENSLI", font=brand_en, fill=gold)
    draw.line((x, 142, x + 64, 142), fill=gold_light, width=2)
    draw.text((x + 82, 128), "万事利丝绸", font=brand_cn, fill=gold)
    draw.line((x + 204, 142, x + 266, 142), fill=gold_light, width=2)

    y = 282
    draw.text((x, y), "AI", font=title_ai, fill=gold)
    ai_w, _ = text_size(draw, "AI", title_ai)
    draw.text((x + ai_w + 18, y + 18), "智能导购", font=title_cn, fill=navy)
    draw.text((x + 2, y + 150), "一键导出图文版 PPT", font=subtitle, fill=navy)
    draw.line((x, y + 225, x + 460, y + 225), fill=gold_light, width=2)
    draw.ellipse((x + 230, y + 219, x + 242, y + 231), outline=gold_light, width=1)

    copy = "面向丝巾、礼盒与商务赠礼场景，把 AI 推荐、商品筛选与方案导出，串成更顺手的客户沟通。"
    draw_wrapped(draw, (x, y + 266), copy, copy_font, body, 470, 16)

    # Bottom feature row: fewer borders, roomier labels, no text crowding.
    draw.rounded_rectangle((56, 1215, 885, 1495), radius=34, fill=(250, 246, 235, 230), outline=(222, 184, 126, 92), width=1)
    top = 1286
    left = 72
    right = 869
    icon_y = top
    label_y = top + 92
    items = [
        ("AI", "AI 对话推荐"),
        ("选", "商品智能筛选"),
        ("PPT", "图文版 PPT 导出"),
        ("↗", "分享跟进更顺畅"),
    ]
    cell_w = (right - left) // 4
    for i, (icon, label) in enumerate(items):
        cx = left + i * cell_w + cell_w // 2
        if i:
            draw.line((left + i * cell_w, top + 6, left + i * cell_w, top + 145), fill=(206, 170, 111, 108), width=1)
        draw.ellipse((cx - 38, icon_y, cx + 38, icon_y + 76), fill=(250, 246, 235, 230), outline=gold, width=2)
        icon_font = font(MSYH_BOLD, 21 if icon != "PPT" else 18)
        draw_centered_text(draw, (cx - 38, icon_y, cx + 38, icon_y + 76), icon, icon_font, gold)
        label_w, _ = text_size(draw, label, feature_font)
        if label_w > cell_w - 20:
            f = font(MSYH, 20)
        else:
            f = feature_font
        draw_centered_text(draw, (cx - cell_w // 2 + 8, label_y, cx + cell_w // 2 - 8, label_y + 42), label, f, navy)
        draw.line((cx - 13, label_y + 60, cx + 13, label_y + 60), fill=gold, width=3)

    footer_y = 1530
    draw.line((106, footer_y, 408, footer_y), fill=(206, 170, 111, 165), width=1)
    draw.line((533, footer_y, 835, footer_y), fill=(206, 170, 111, 165), width=1)
    mark_font = font(CAMBRIA_BOLD, 38)
    draw_centered_text(draw, (440, footer_y - 22, 501, footer_y + 28), "W", mark_font, gold)
    draw_centered_text(draw, (250, footer_y + 50, 691, footer_y + 76), "匠 心 丝 绸  ·  智 慧 相 伴", font(MSYH, 18), gold)
    draw_centered_text(draw, (204, footer_y + 91, 737, footer_y + 116), "让 每 一 次 推 荐 ， 都 成 为 更 好 的 连 接", small_font, gold)

    img.convert("RGB").save(dst, quality=95)


if __name__ == "__main__":
    refine_dark()
    refine_light()
    print("refined posters saved")
