#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import web
import main

urls = (
    '/api/v1/update_linker/(.*)/(.*)', 'update_linker',
    '/api/v1/update_linker_music/(.*)/(.*)/(.*)/(.*)', 'update_linker_music',
    '/api/v1/update_freqs/(.*)', 'update_freqs',
    '/api/v1/update_composer', 'update_composer'
)
web.config.debug = False
app = web.application(urls, globals())


class update_linker:
    def GET(self,word,n):
        web.header('Content-Type', 'application/json')
        web.header('Access-Control-Allow-Origin',      '*')
        web.header('Access-Control-Allow-Credentials', 'true')
        return main.linker(word,n)

class update_linker_music:
    def GET(self,word,n,yi,ye):
        web.header('Content-Type', 'application/json')
        web.header('Access-Control-Allow-Origin',      '*')
        web.header('Access-Control-Allow-Credentials', 'true')
        return main.linkerC(word,n,yi,ye)

class update_freqs:
    def GET(self,word):
        web.header('Content-Type', 'application/json')
        web.header('Access-Control-Allow-Origin',      '*')
        web.header('Access-Control-Allow-Credentials', 'true')
        return main.freqData(word)


if __name__ == "__main__":
    app.run()
