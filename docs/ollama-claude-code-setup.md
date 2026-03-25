# Ollama + Claude Code Setup

Run Claude Code locally using Ollama's Anthropic-compatible API instead of the Anthropic cloud API.

## Prerequisites

- macOS with Homebrew
- Claude Code installed (`curl -fsSL https://claude.ai/install.sh | bash`)

## Hardware Requirements

| Model | RAM Required | Notes |
|-------|-------------|-------|
| `qwen3-coder` | ~6GB | **Recommended** — coding-specialized |
| `gpt-oss:20b` | ~12GB | General coding, slower |
| `glm-4.7` | ~6GB | Multilingual, weaker at code |
| `gpt-oss:120b` | ~70GB | Requires 80GB+ RAM |

For a 16GB M2 MacBook, use `qwen3-coder`.

## Installation

### 1. Install Ollama

```shell
brew install ollama
```

### 2. Start the Ollama service

```shell
brew services start ollama
```

Verify it's running:
```shell
curl http://localhost:11434/api/version
# Expected: {"version":"0.x.x"}
```

### 3. Pull a model

```shell
ollama pull qwen3-coder
```

Check progress / confirm download complete:
```shell
ollama list
```

### 4. Set environment variables

Add to `~/.zshrc` (or `~/.bashrc`):

```shell
# Ollama — Claude Code compatibility
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_API_KEY=""
export ANTHROPIC_BASE_URL=http://localhost:11434
```

Reload your shell:
```shell
source ~/.zshrc
```

Verify:
```shell
echo $ANTHROPIC_BASE_URL    # http://localhost:11434
echo $ANTHROPIC_AUTH_TOKEN  # ollama
```

## Usage

```shell
claude --model qwen3-coder
```

Or inline (without modifying `.zshrc`):

```shell
ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://localhost:11434 ANTHROPIC_API_KEY="" claude --model qwen3-coder
```

## Switching Back to Anthropic API

To temporarily revert to the cloud API in the current terminal session:

```shell
unset ANTHROPIC_BASE_URL ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY
```

To make it permanent, remove the three `export` lines from `~/.zshrc`.

## Context Length

Claude Code requires a large context window — at least 64k tokens. To configure context length in Ollama, see: https://docs.ollama.com/context-length

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `connection refused` on port 11434 | `brew services restart ollama` |
| Model not found | `ollama pull qwen3-coder` |
| Slow responses | Reduce other RAM usage; close browsers/apps |
| Out of memory crash | Switch to a smaller model (`qwen3-coder` over `gpt-oss:20b`) |
