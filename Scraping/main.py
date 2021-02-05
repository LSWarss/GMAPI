from bs4 import BeautifulSoup
import requests

urls = {
    'games_pc' : 'https://www.metacritic.com/browse/games/release-date/coming-soon/pc/date?page=1'
}

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
metacritic_games_pc_html=requests.get(urls['games_pc'], headers=headers).text
bs = BeautifulSoup(metacritic_games_pc_html,  'lxml')

def get_games(bs):
    games_list = bs.find_all('table', class_='clamp-list')
    # print(games_list)

    with open('output.txt', 'w') as txt_file: 
        for table in games_list:
            games_in_table = table.find_all('tr')
            for game in games_in_table:
                # print(game)
                game_title = game.find('a', class_='title')
                print(game_title)
                game_platform =  game.find('span', class_='data')
                print(game_platform)
                txt_file.write(f"{game_title} {game_platform}" + "\n")
    
get_games(bs)