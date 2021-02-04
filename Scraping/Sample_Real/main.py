from bs4 import BeautifulSoup
import requests


html_text = requests.get('https://www.pracuj.pl/praca/python;kw?rd=30').text
bs = BeautifulSoup(html_text, 'lxml')
job = bs.find('li', class_='results__list-container-item')
job_title = job.find('h3', class_='offer-details__title').text
job_company = job.find('a', class_='offer-company__name').text
job_localtion = job.find('li', class_='offer-labels__item--location').text.replace(' ', '')
job_published = job.find('span', class_ = 'offer-actions__date').text
print(f'''
{job_title} for {job_company}
location: {job_localtion}
{job_published}''')