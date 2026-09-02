"""Copy the exact Chinese RapidOCR models required by the desktop application."""
from __future__ import annotations

import shutil
from importlib.resources import files
from pathlib import Path

from app import OFFLINE_MODEL_FILENAMES


def main() -> None:
    source_root = Path(str(files("rapidocr").joinpath("models")))
    destination_root = Path(__file__).parent / "offline-assets" / "rapidocr-models"
    destination_root.mkdir(parents=True, exist_ok=True)
    for filename in OFFLINE_MODEL_FILENAMES.values():
        source, destination = source_root / filename, destination_root / filename
        if not source.is_file():
            raise FileNotFoundError(f"RapidOCR model is unavailable: {source}")
        shutil.copy2(source, destination)
    print(f"Offline OCR assets prepared at {destination_root}")


if __name__ == "__main__":
    main()
