from bs4 import BeautifulSoup

with open('home.html', 'r') as html_file:
    content = html_file.read()
    
    bs = BeautifulSoup(content, 'lxml')
    course_cards = bs.find_all('div', class_='card')
    for cousre in course_cards: 
        course_name = cousre.h5.text
        course_price = cousre.a.text.split()[-1]
        print(f'{course_name} costs {course_price}')