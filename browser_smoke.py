import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
base=Path('/mnt/data/my-budget-v2/dist')
def src(name):return (base/'assets'/name).read_text()
source=src('finance.js').replace('export const ','const ').replace('export function ','function ')
source+='\n'+src('advanced.js').replace("import {monthly,sum,categoryKeys} from './finance.js';",'').replace('export const ','const ').replace('export function ','function ')
source+='\n'+src('i18n.js').replace('export const messages','const messages')
source+='\n'+src('i18n-v2.js').replace("import {messages as base} from './i18n.js';",'').replace('export const messages=base;','')
source+='\n'+ '\n'.join(x for x in src('app.js').splitlines() if not x.startswith('import '))
async def main():
 async with async_playwright() as t:
  browser=await t.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  page=await browser.new_page(viewport={'width':1440,'height':900})
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  html=(base/'index.html').read_text();html=html.replace('<script type="module" src="assets/app.js"></script>','')
  html=html.replace('<link rel="stylesheet" href="assets/style.css">','<style>'+src('style.css')+'</style>').replace('<link rel="stylesheet" href="assets/advanced.css">','<style>'+src('advanced.css')+'</style>')
  await page.set_content(html)
  await page.add_script_tag(content=source)
  print('Page title:',await page.title())
  print('Navigation:',await page.locator('#navigation a').all_text_contents())
  assert await page.locator('#navigation a').count()==12
  await page.locator('a[href="#subscriptions"]').click()
  assert await page.locator('#main h1').inner_text()=='Keep recurring costs in view.'
  await page.locator('[data-action="add-subscription"]').first.click()
  await page.locator('dialog input[name="name"]').fill('Music subscription')
  await page.locator('dialog input[name="amount"]').fill('12')
  await page.locator('dialog button[type="submit"]').click()
  assert await page.locator('#main').get_by_text('Music subscription').count()==1
  await page.locator('a[href="#debts"]').click()
  await page.locator('[data-action="add-debt"]').first.click()
  await page.locator('dialog input[name="name"]').fill('Card')
  await page.locator('dialog input[name="balance"]').fill('3000')
  await page.locator('dialog input[name="apr"]').fill('18')
  await page.locator('dialog input[name="minPayment"]').fill('150')
  await page.locator('dialog button[type="submit"]').click()
  assert 'Card' in (await page.locator('#main').inner_text())
  await page.locator('a[href="#insights"]').click()
  await page.locator('input[name="cap-food"]').fill('200')
  await page.locator('[data-action="save-limits"]').click()
  assert (await page.evaluate('state.caps.food'))==200
  await page.locator('a[href="#taxCenter"]').click()
  await page.locator('#tax-country').fill('Germany')
  await page.locator('#tax-year').fill('2026')
  await page.locator('[data-action="save-tax"]').click()
  await page.locator('#tax-doc-new').fill('Annual income certificate')
  await page.locator('[data-action="add-tax-doc"]').click()
  await page.locator('[data-action="toggle-tax-doc"]').click()
  assert await page.evaluate("state.taxProfile.documents[0].status")=='done'
  await page.locator('#navigation a[href="#overview"]').click()
  await page.screenshot(path='/mnt/data/my-budget-v2/overview-desktop.png',full_page=True)
  await page.locator('#language').select_option('ar')
  await page.locator('a[href="#insights"]').click()
  await page.screenshot(path='/mnt/data/my-budget-v2/insights-ar-desktop.png',full_page=True)
  assert await page.locator('html').get_attribute('dir')=='rtl'
  small=await browser.new_page(viewport={'width':390,'height':844})
  await small.set_content(html)
  await small.add_script_tag(content=source)
  await small.locator('a[href="#subscriptions"]').click()
  await small.screenshot(path='/mnt/data/my-budget-v2/subscriptions-mobile.png',full_page=True)
  print('Page errors:',errors)
  assert not errors,errors
  await browser.close()
asyncio.run(main())
