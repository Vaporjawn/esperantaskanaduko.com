#!/bin/bash

# Esperanto Hangman - Deployment Setup Script
# This script helps set up automated deployment for GitHub Pages and Surge

set -e

echo "🎮 Esperanto Hangman - Deployment Setup"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if surge is installed
if ! command -v surge &> /dev/null; then
    echo -e "${YELLOW}Surge CLI not found. Installing globally...${NC}"
    npm install -g surge
fi

# Check if gh-pages is installed locally
if ! npm list gh-pages &> /dev/null; then
    echo -e "${YELLOW}Installing gh-pages...${NC}"
    npm install --save-dev gh-pages
fi

echo ""
echo -e "${BLUE}Step 1: Surge Setup${NC}"
echo "===================="
echo ""
echo "Surge is a free static hosting platform."
echo "You'll need to create an account if you don't have one."
echo ""

# Get Surge token
echo -e "${YELLOW}Please run 'surge token' in a separate terminal to get your token.${NC}"
read -p "Enter your Surge token: " SURGE_TOKEN
read -p "Enter your Surge email: " SURGE_EMAIL

if [ -z "$SURGE_TOKEN" ] || [ -z "$SURGE_EMAIL" ]; then
    echo -e "${RED}Error: Surge credentials are required.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Surge credentials collected${NC}"

echo ""
echo -e "${BLUE}Step 2: GitHub Repository Setup${NC}"
echo "================================"
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${RED}Error: Not a git repository. Please run 'git init' first.${NC}"
    exit 1
fi

# Get GitHub repository info
GITHUB_USER=$(git config user.name || echo "")
REPO_NAME=$(basename `git rev-parse --show-toplevel`)

echo "Detected repository: ${GITHUB_USER}/${REPO_NAME}"
read -p "Is this correct? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    read -p "Enter GitHub username: " GITHUB_USER
    read -p "Enter repository name: " REPO_NAME
fi

echo ""
echo -e "${BLUE}Step 3: Setting up GitHub Secrets${NC}"
echo "=================================="
echo ""
echo "You need to add the following secrets to your GitHub repository:"
echo ""
echo -e "${YELLOW}1. Go to: https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/secrets/actions${NC}"
echo -e "${YELLOW}2. Click 'New repository secret'${NC}"
echo ""
echo -e "${GREEN}Add these secrets:${NC}"
echo "   Name: SURGE_TOKEN"
echo "   Value: ${SURGE_TOKEN}"
echo ""
echo "   Name: SURGE_LOGIN"
echo "   Value: ${SURGE_EMAIL}"
echo ""
read -p "Press Enter once you've added the secrets to continue..."

echo ""
echo -e "${BLUE}Step 4: GitHub Pages Setup${NC}"
echo "=========================="
echo ""
echo -e "${YELLOW}1. Go to: https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages${NC}"
echo -e "${YELLOW}2. Under 'Source', select 'Deploy from a branch'${NC}"
echo -e "${YELLOW}3. Select branch: 'gh-pages' and folder: '/ (root)'${NC}"
echo -e "${YELLOW}4. Click 'Save'${NC}"
echo ""
read -p "Press Enter once you've configured GitHub Pages..."

echo ""
echo -e "${BLUE}Step 5: Initial Deployment${NC}"
echo "========================="
echo ""
read -p "Would you like to deploy now? (y/n): " DEPLOY_NOW

if [ "$DEPLOY_NOW" = "y" ]; then
    echo ""
    echo "Building project..."
    npm run build
    
    echo ""
    echo "Deploying to GitHub Pages..."
    npm run deploy
    
    echo ""
    echo "Deploying to Surge..."
    npx surge ./dist esperanto-hangman.surge.sh --token $SURGE_TOKEN
    
    echo ""
    echo -e "${GREEN}✓ Deployment complete!${NC}"
fi

echo ""
echo "================================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Your deployments are now configured:"
echo ""
echo -e "${BLUE}GitHub Pages:${NC} https://${GITHUB_USER}.github.io/${REPO_NAME}/"
echo -e "${BLUE}Surge:${NC} https://esperanto-hangman.surge.sh"
echo ""
echo "Future deployments will happen automatically when you push to main:"
echo ""
echo "  git add ."
echo "  git commit -m \"Your changes\""
echo "  git push origin main"
echo ""
echo "You can also deploy manually:"
echo ""
echo "  npm run deploy          # GitHub Pages only"
echo "  npm run deploy:surge    # Surge only"
echo "  npm run deploy:both     # Both platforms"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
