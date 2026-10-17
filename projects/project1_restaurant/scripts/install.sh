
#!/usr/bin/env bash

set -u

echo "======================================"
echo "       RESTORA INSTALLER"
echo "======================================"

# 1. Check whether Docker CLI is installed
if ! command -v docker >/dev/null 2>&1; then
    echo "[ERROR] Docker is not installed."
    echo "Docker installation will be handled in the next step."
    exit 1
fi

# 2. Print Docker version
echo "[OK] Docker is installed."
echo "Docker executable: $(command -v docker)"
docker --version

# 3. Check current Linux user
CURRENT_USER="${USER:-$(id -un)}"

echo "Current user: ${CURRENT_USER}"
echo "User ID: $(id -u)"

# 4. Check whether Docker daemon is accessible
if docker info >/dev/null 2>&1; then
    echo "[OK] Docker daemon is running."
    echo "[OK] Current user can execute Docker commands."
    echo "[SUCCESS] Docker environment is ready."

    exit 0
fi

# 5. Distinguish permission issues from daemon issues
if sudo -n docker info >/dev/null 2>&1; then
    echo "[WARNING] Docker works with sudo, but not as the current user."
    echo "The current user may need Docker group access."
    echo "WARNING: Membership in the docker group grants root-level privileges."
    echo "Review the security implications before changing permissions."
    exit 2
fi

echo "[WARNING] Docker is installed, but Docker daemon access failed."
echo "Possible causes:"
echo "- Docker service is not running."
echo "- Current user lacks permission."
echo "- Docker daemon is not responding."

echo "Check the service with:"
echo "  sudo systemctl status docker"

echo "Check access with:"
echo "  docker info"

exit 3
# 2- install Docker Image For Project  Docker Compose ( Front - Back - DB an Create Volume )