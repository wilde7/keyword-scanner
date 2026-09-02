"""Windows desktop sidecar entry point for the local scanning API."""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

import uvicorn

if getattr(sys, "frozen", False):
    os.environ["KEYWORD_SCANNER_ASSETS"] = str(Path(sys.executable).resolve().parent / "offline-assets")
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

from app import app


def main() -> None:
    parser = argparse.ArgumentParser(description="关键词检索器本地扫描服务")
    parser.add_argument("--port", type=int, required=True)
    args = parser.parse_args()
    uvicorn.run(app, host="127.0.0.1", port=args.port, log_level="warning")


if __name__ == "__main__":
    main()
