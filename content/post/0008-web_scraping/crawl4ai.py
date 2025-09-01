import asyncio
import time
from crawl4ai.async_webcrawler import AsyncWebCrawler


async def main():
    async with AsyncWebCrawler() as crawler:
        starttime = time.time()
        result = await crawler.arun(
            url="https://www.nbcnews.com/business",
        )
        print(f"Time taken: {time.time() - starttime:.2f} seconds")
        print(result.markdown)


if __name__ == "__main__":
    asyncio.run(main())
