#!/bin/bash

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to install dependencies
install_dependencies() {
  echo -e "${YELLOW}🔄 Installing dependencies with force flag...${NC}"
  npm i --force
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
    return 0
  else
    echo -e "${RED}❌ Installation failed. Please check the errors above.${NC}"
    return 1
  fi
}

# Function to start development server
start_dev_server() {
  echo -e "${BLUE}🚀 Starting development server...${NC}"
  echo -e "${CYAN}ℹ️  Press Ctrl+C to stop the server${NC}"
  npm run dev
}

# Function to build the project
build_project() {
  echo -e "${PURPLE}🏗️  Building project...${NC}"
  npm run build
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
  else
    echo -e "${RED}❌ Build failed. Please check the errors above.${NC}"
  fi
}

# Function to clean up cache files and rebuild
clean_and_restart() {
  echo -e "${YELLOW}🧹 Cleaning up cache and build files...${NC}"
  
  # Remove .next directory
  if [ -d ".next" ]; then
    echo -e "${CYAN}Removing .next directory...${NC}"
    rm -rf .next
  fi
  
  # Remove node_modules directory
  if [ -d "node_modules" ]; then
    echo -e "${CYAN}Removing node_modules directory...${NC}"
    rm -rf node_modules
  fi
  
  # Remove contentlayer cache files
  if [ -d ".contentlayer" ]; then
    echo -e "${CYAN}Removing .contentlayer directory...${NC}"
    rm -rf .contentlayer
  fi
  
  # Remove any other cache files
  if [ -d ".cache" ]; then
    echo -e "${CYAN}Removing .cache directory...${NC}"
    rm -rf .cache
  fi
  
  echo -e "${GREEN}✅ Clean up completed!${NC}"
  
  # Re-install dependencies
  echo -e "${YELLOW}📦 Reinstalling dependencies...${NC}"
  install_dependencies
  
  # Start dev server
  echo -e "${BLUE}🚀 Restarting development server...${NC}"
  echo -e "${CYAN}ℹ️  Press Ctrl+C to stop the server${NC}"
  npm run dev
}

# Function to clean up cache files and rebuild
clean_and_rebuild() {
  echo -e "${YELLOW}🧹 Cleaning up cache and build files...${NC}"
  
  # Remove .next directory
  if [ -d ".next" ]; then
    echo -e "${CYAN}Removing .next directory...${NC}"
    rm -rf .next
  fi
  
  # Remove node_modules directory
  if [ -d "node_modules" ]; then
    echo -e "${CYAN}Removing node_modules directory...${NC}"
    rm -rf node_modules
  fi
  
  # Remove contentlayer cache files
  if [ -d ".contentlayer" ]; then
    echo -e "${CYAN}Removing .contentlayer directory...${NC}"
    rm -rf .contentlayer
  fi
  
  # Remove any other cache files
  if [ -d ".cache" ]; then
    echo -e "${CYAN}Removing .cache directory...${NC}"
    rm -rf .cache
  fi
  
  echo -e "${GREEN}✅ Clean up completed!${NC}"
  
  # Re-install dependencies
  echo -e "${YELLOW}📦 Reinstalling dependencies...${NC}"
  install_dependencies
  
  # Build project
  build_project
}

# Function to create a new MDX snippet file
create_snippet() {
  echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${BLUE}║               ${PURPLE}Create New Snippet MDX File${BLUE}                ║${NC}"
  echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
  echo ""
  
  # Check if /pages directory exists
  if [ ! -d "pages" ]; then
    echo -e "${RED}❌ '/pages' directory not found. Are you in the project root?${NC}"
    return 1
  fi
  
  # Ask if new folder is needed
  echo -e "${CYAN}Do you need to create a new folder for this snippet? (y/n)${NC}"
  read -p "> " need_folder
  
  folder_path="pages"
  
  if [[ $need_folder == "y" || $need_folder == "Y" ]]; then
    echo -e "${CYAN}Enter the name of the new folder:${NC}"
    read -p "> " folder_name
    
    # Create the folder if it doesn't exist
    folder_path="pages/$folder_name"
    if [ ! -d "$folder_path" ]; then
      mkdir -p "$folder_path"
      echo -e "${GREEN}✅ Created folder: $folder_path${NC}"
    else
      echo -e "${YELLOW}⚠️  Folder already exists: $folder_path${NC}"
    fi
  else
    # Ask for the path within pages
    echo -e "${CYAN}Where do you want to create the snippet? (Enter path starting from 'pages/')${NC}"
    echo -e "${YELLOW}Example: snippets/react or leave blank for root pages directory${NC}"
    read -p "> " custom_path
    
    if [ ! -z "$custom_path" ]; then
      folder_path="pages/$custom_path"
      
      # Create the path if it doesn't exist
      if [ ! -d "$folder_path" ]; then
        mkdir -p "$folder_path"
        echo -e "${GREEN}✅ Created directory path: $folder_path${NC}"
      fi
    fi
  fi
  
  # Ask for the file name
  echo -e "${CYAN}Enter the name for your snippet file (without .mdx extension):${NC}"
  read -p "> " file_name
  
  # Add .mdx extension if not present
  if [[ ! $file_name == *".mdx" ]]; then
    file_name="$file_name.mdx"
  fi
  
  file_path="$folder_path/$file_name"
  
  # Check if file already exists
  if [ -f "$file_path" ]; then
    echo -e "${YELLOW}⚠️  A file with this name already exists.${NC}"
    echo -e "${CYAN}Do you want to overwrite it? (y/n)${NC}"
    read -p "> " overwrite
    
    if [[ ! $overwrite == "y" && ! $overwrite == "Y" ]]; then
      echo -e "${YELLOW}Operation cancelled.${NC}"
      return 0
    fi
  fi
  
  # Ask for title and description
  echo -e "${CYAN}Enter a title for your snippet:${NC}"
  read -p "> " snippet_title
  
  echo -e "${CYAN}Enter a description for your snippet:${NC}"
  read -p "> " snippet_description
  
  echo -e "${CYAN}Enter tags (comma separated):${NC}"
  read -p "> " snippet_tags
  
  # Format current date
  current_date=$(date +"%Y-%m-%d")
  
  # Create the MDX file
  cat > "$file_path" << EOF
---
title: "$snippet_title"
description: "$snippet_description"
date: "$current_date"
tags: [$snippet_tags]
published: true
---

import Layout from "@/components/layout"
import CodeBlock from "@/components/ui/codeblock"

<Layout>

# $snippet_title

## Overview

$snippet_description

## Code Snippet

<CodeBlock language="javascript">
{\`
// Your code snippet here
function example() {
  console.log("Hello world!");
}

example();
\`}
</CodeBlock>

## How to Use

Explain how to use this snippet, including any prerequisites or dependencies.

1. First step...
2. Second step...
3. Third step...

## Example Implementation

Here's an example of how this snippet can be used in a real-world scenario:

<CodeBlock language="jsx">
{\`
import React from 'react';

// Example implementation
function ExampleComponent() {
  return (
    <div>
      <h1>Example</h1>
      {/* Implementation details */}
    </div>
  );
}

export default ExampleComponent;
\`}
</CodeBlock>

## Notes

- Add any important notes or caveats here
- Mention any potential issues or considerations

## References

- [Link to relevant documentation](https://example.com)
- [Another useful resource](https://example.com)

</Layout>

export default ({ children }) => <>{children}</>
EOF

  echo -e "${GREEN}✅ Created snippet file: $file_path${NC}"
  echo -e "${YELLOW}📝 Edit the file to add your actual code and documentation.${NC}"
}

# Function to show the menu and get user input
show_menu() {
  # Clear screen to start fresh
  clear

  # Header
  echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${BLUE}║                                                        ║${NC}"
  echo -e "${BOLD}${BLUE}║  ${PURPLE}Remco Stoeten's Snippets ${BLUE}- ${YELLOW}Legacy v1 Setup Helper${BLUE}  ║${NC}"
  echo -e "${BOLD}${BLUE}║                                                        ║${NC}"
  echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
  echo ""

  # Warning about legacy branch
  echo -e "${YELLOW}⚠️  IMPORTANT: This is the legacy v1 branch ⚠️${NC}"
  echo -e "${CYAN}This version requires specific installation steps to work properly.${NC}"
  echo ""

  # Menu
  echo -e "${BOLD}${BLUE}What would you like to do?${NC}"
  echo -e "  ${GREEN}1) ${NC}Install dependencies & start dev server ${GREEN}🚀${NC}"
  echo -e "  ${GREEN}2) ${NC}Install dependencies only ${YELLOW}📦${NC}"
  echo -e "  ${GREEN}3) ${NC}Build project ${PURPLE}🏗️${NC}"
  echo -e "  ${GREEN}4) ${NC}Clean cache and restart dev server ${BLUE}🧹${NC}"
  echo -e "  ${GREEN}5) ${NC}Clean cache and rebuild project ${PURPLE}🔄${NC}"
  echo -e "  ${GREEN}6) ${NC}Create new snippet MDX file ${CYAN}📝${NC}"
  echo -e "  ${GREEN}0) ${NC}Exit ${RED}❌${NC}"
  echo ""

  read -p "Enter your choice (0-6): " choice
  process_choice $choice
}

# Function to process the user's choice
process_choice() {
  case $1 in
    1)
      if install_dependencies; then
        start_dev_server
      fi
      ;;
      
    2)
      install_dependencies
      ;;
      
    3)
      build_project
      ;;
      
    4)
      clean_and_restart
      ;;
      
    5)
      clean_and_rebuild
      ;;
      
    6)
      create_snippet
      ;;
      
    0)
      echo -e "${RED}Exiting setup helper. Goodbye! 👋${NC}"
      exit 0
      ;;
      
    *)
      echo -e "${RED}❌ Invalid option. Please run the script again and select a valid option.${NC}"
      exit 1
      ;;
  esac

  echo ""
  echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}⭐ Thank you for using Remco's Snippets! ⭐${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
}

# Show help message
show_help() {
  echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
  echo -e "${BOLD}${CYAN}Legacy v1 Branch Setup Helper - Command Line Options${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}--1${NC}: Install dependencies & start dev server"
  echo -e "${GREEN}--2${NC}: Install dependencies only"
  echo -e "${GREEN}--3${NC}: Build project"
  echo -e "${GREEN}--4${NC}: Clean cache and restart dev server"
  echo -e "${GREEN}--5${NC}: Clean cache and rebuild project"
  echo -e "${GREEN}--6${NC}: Create new snippet MDX file"
  echo -e "${GREEN}--0${NC}: Exit script"
  echo -e "${GREEN}--help${NC} or ${GREEN}-h${NC}: Show this help message"
  echo -e "${GREEN}(no args)${NC}: Show interactive menu"
  echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
}

# Check if command line argument was provided
if [[ $1 == "--1" ]]; then
  process_choice 1
elif [[ $1 == "--2" ]]; then
  process_choice 2
elif [[ $1 == "--3" ]]; then
  process_choice 3
elif [[ $1 == "--4" ]]; then
  process_choice 4
elif [[ $1 == "--5" ]]; then
  process_choice 5
elif [[ $1 == "--6" ]]; then
  process_choice 6
elif [[ $1 == "--0" ]]; then
  process_choice 0
elif [[ $1 == "--help" || $1 == "-h" ]]; then
  show_help
  exit 0
else
  # No valid command line argument, show the menu
  show_menu
fi