#!/usr/local/bin/python
# -*- coding: utf-8 -*-
from py_bing_search import PyBingWebSearch

def getResultsList(word,numResults):
    bing_web = PyBingWebSearch('cdos0agEe4I2roLpBVQC6WHZErUb3ih4sU75CvxOlDI', word, web_only=True)
    results= bing_web.search(limit=numResults, format='json')
    return results

def getResultsDescriptionList(word,numResults):
    results=getResultsList(word,numResults)
    descriptions=[]
    for result in results:
        descriptions.append(result.description)
    return descriptions
