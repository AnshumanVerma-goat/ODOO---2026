from app.core.responses import PageMeta


def build_page_meta(page: int, size: int, total: int) -> PageMeta:
    pages = (total + size - 1) // size if total else 0
    return PageMeta(page=page, size=size, total=total, pages=pages)
