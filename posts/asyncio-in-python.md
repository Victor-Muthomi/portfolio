---
title: Asyncio in Python: Concurrency Made Simple
date: 2025-08-16
author: Victor
category: Python
tags: asyncio, concurrency, async, await, python
excerpt: Learn how to use Python's asyncio to write concurrent I/O-bound code with async/await, event loops, and tasks.
image: /static/images/posts/asyncio-python.jpg
updated_date: 2025-08-16
---

Python's asyncio library enables high-performance, concurrent programs for I/O-bound tasks such as network calls, database requests, and file operations. Instead of spawning threads, asyncio uses cooperative multitasking built on coroutines, an event loop, and non-blocking I/O.

## Why asyncio?
- Threads are great, but they have overhead and complexity (locks, races, GIL limitations).
- Asyncio shines for workloads where your code waits frequently on I/O (HTTP requests, sockets, DB queries).
- With async/await, you write straightforward code that yields control while waiting, letting the event loop run other tasks.

## Core concepts
- Event loop: The scheduler that runs your coroutines.
- Coroutine: A function defined with `async def` that can be paused and resumed.
- Awaitable: Something you can `await` (a coroutine, Task, or Future).
- Task: A scheduled coroutine managed by the loop.

## Minimal example
```python
import asyncio

async def fetch(idx: int):
    print(f"Start {idx}")
    # Simulate I/O
    await asyncio.sleep(1)
    print(f"Done {idx}")
    return idx

async def main():
    tasks = [asyncio.create_task(fetch(i)) for i in range(3)]
    results = await asyncio.gather(*tasks)
    print(results)

if __name__ == "__main__":
    asyncio.run(main())
```
This runs `fetch` concurrently and completes in ~1 second instead of ~3.

## Converting blocking code
Any blocking I/O inside an async function will stall the entire loop. Use async-friendly libraries, or offload CPU-bound or blocking work:

```python
import asyncio
import aiohttp

async def get_json(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            resp.raise_for_status()
            return await resp.json()

async def main():
    urls = [
        "https://api.github.com/repos/pallets/flask",
        "https://api.github.com/repos/pallets/jinja",
        "https://api.github.com/repos/pallets/werkzeug",
    ]
    results = await asyncio.gather(*(get_json(u) for u in urls))
    print([r["full_name"] for r in results])

asyncio.run(main())
```

If you must call blocking code, offload it:
```python
import asyncio
import time

def blocking_io(n: int) -> int:
    time.sleep(2)  # blocks
    return n * n

async def main():
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, blocking_io, 10)
    print(result)

asyncio.run(main())
```

## Cancellation and timeouts
Tasks should handle cancellation to keep your app responsive:
```python
import asyncio

async def work():
    try:
        while True:
            await asyncio.sleep(0.5)
    except asyncio.CancelledError:
        # cleanup here
        raise

async def main():
    task = asyncio.create_task(work())
    await asyncio.sleep(1.5)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        print("Cancelled")

asyncio.run(main())
```

Use timeouts to bound latency:
```python
await asyncio.wait_for(some_async_call(), timeout=3.0)
```

## Structured concurrency patterns
- `asyncio.gather`: Run tasks concurrently and collect results. Use `return_exceptions=True` if you want all results even when some fail.
- `asyncio.TaskGroup` (Python 3.11+): Prefer for structured concurrency and better error handling.

```python
import asyncio

async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(asyncio.sleep(1))
        tg.create_task(asyncio.sleep(2))

asyncio.run(main())
```

## Best practices
- Prefer async-native libraries (aiohttp, asyncpg, aiosmtplib, etc.).
- Don’t mix blocking I/O in async functions.
- Batch I/O with `gather` to reduce round-trips.
- Use backpressure and semaphores to limit concurrency against external services.
- Propagate cancellations and handle `CancelledError` explicitly.
- Add observability: log task creation, durations, and exceptions.

```python
import asyncio
import aiohttp

SEM = asyncio.Semaphore(10)

async def fetch(session, url):
    async with SEM:  # limit concurrency
        async with session.get(url, timeout=5) as r:
            r.raise_for_status()
            return await r.text()

async def crawl(urls):
    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(*(fetch(session, u) for u in urls), return_exceptions=True)
```

## When not to use asyncio
- CPU-bound workloads (use multiprocessing or C extensions/SIMD).
- Simple scripts with small amounts of I/O where complexity isn’t justified.
- Integrations that require thread-only APIs.

## Summary
Asyncio lets you scale I/O-bound Python code efficiently with a clear async/await syntax. Start small: migrate a single I/O-heavy path, adopt async-native libraries, and measure the impact. With careful cancellation, timeouts, and concurrency limits, you’ll unlock significant throughput without adding thread complexity.


---