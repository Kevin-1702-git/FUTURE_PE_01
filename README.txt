FEAST LANE IMAGE FETCHER

1. Open .env and paste your NEW Pexels API key:
   PEXELS_API_KEY=your_new_key_here

2. Install dependencies:
   pip install requests python-dotenv

3. Run:
   python image_fetcher.py

The script searches Pexels for all 224 Feast Lane menu items, downloads
the best matching landscape image into food_images/<category>/, and creates
food_images.csv with the image filename and source URLs.

IMPORTANT:
- Rotate the API key that was previously pasted into chat.
- Do not commit .env to GitHub.
