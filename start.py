#!/usr/bin/env python3
"""Start the Decision Making Lab application."""

import subprocess
import sys
import time
import os

APP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app")
CONTAINER = "decisionlab-db"
DB_USER = "decisionlab"
DB_PASS = "decisionlab2026"
DB_NAME = "decisionlab"
DB_PORT = "5433"


def run(cmd, cwd=APP_DIR, check=True):
    return subprocess.run(cmd, cwd=cwd, shell=True, check=check)


def is_container_running():
    result = subprocess.run(
        f"docker inspect -f '{{{{.State.Running}}}}' {CONTAINER}",
        shell=True, capture_output=True, text=True,
    )
    return result.returncode == 0 and "true" in result.stdout


def start_db():
    if is_container_running():
        print("✓ PostgreSQL container already running")
        return

    # Check if container exists but is stopped
    result = subprocess.run(
        f"docker inspect {CONTAINER}", shell=True, capture_output=True,
    )
    if result.returncode == 0:
        print("→ Starting existing PostgreSQL container...")
        run(f"docker start {CONTAINER}", cwd=".")
    else:
        print("→ Creating PostgreSQL container...")
        run(
            f"docker run -d --name {CONTAINER} "
            f"-e POSTGRES_USER={DB_USER} "
            f"-e POSTGRES_PASSWORD={DB_PASS} "
            f"-e POSTGRES_DB={DB_NAME} "
            f"-p {DB_PORT}:5432 postgres:16-alpine",
            cwd=".",
        )

    print("→ Waiting for PostgreSQL to be ready...", end="", flush=True)
    for _ in range(30):
        check = subprocess.run(
            f"docker exec {CONTAINER} pg_isready -U {DB_USER}",
            shell=True, capture_output=True,
        )
        if check.returncode == 0:
            print(" ready")
            return
        print(".", end="", flush=True)
        time.sleep(1)
    print("\n✗ PostgreSQL failed to start")
    sys.exit(1)


def install_deps():
    if not os.path.isdir(os.path.join(APP_DIR, "node_modules")):
        print("→ Installing dependencies...")
        run("npm install")
    else:
        print("✓ Dependencies installed")


def run_migrations():
    print("→ Running database migrations...")
    run("npx prisma migrate deploy")


def seed_if_empty():
    result = subprocess.run(
        f'docker exec {CONTAINER} psql -U {DB_USER} -d {DB_NAME} '
        f'-tAc "SELECT COUNT(*) FROM users"',
        shell=True, capture_output=True, text=True,
    )
    count = result.stdout.strip()
    if count == "0" or result.returncode != 0:
        print("→ Seeding database...")
        run("npx tsx prisma/seed.ts")
    else:
        print(f"✓ Database has {count} users")


def start_dev():
    print("\n🚀 Starting dev server at http://localhost:3000\n")
    try:
        run("npm run dev", check=False)
    except KeyboardInterrupt:
        print("\n\nServer stopped.")


if __name__ == "__main__":
    start_db()
    install_deps()
    run_migrations()
    seed_if_empty()
    start_dev()
