from bs4 import BeautifulSoup
import requests

urls = {
    'games_pc' : 'https://www.metacritic.com/browse/games/release-date/coming-soon/pc/date'
}

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
metacritic_games_pc_html=requests.get(urls['games_pc'], headers=headers).text
bs = BeautifulSoup(metacritic_games_pc_html,  'lxml')

games_list = bs.find('table', class_='clamp-list')
# print(games_list)
game = games_list.find('tr')
print(game)