#!/usr/local/bin/python
# -*- coding: utf-8 -*-
from py_bing_search import PyBingWebSearch
import os
import codecs

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

def getResultsDescriptionListCorpus(path,word, yearInit, yearEnd):
    descriptions=[]
    for file in os.listdir(path):
        if not file.endswith("_errors"):
            print(file)
            name=path+"/"+file
            year=int(str(file))
            print("Year: "+str(year))
            if(year>=int(yearInit) and year<=int(yearEnd)):
                for file in os.listdir(name):
                    if file.endswith(".txt"):
                        name2=name+"/"+file
                        print name2
                        f = codecs.open(name2, "r", "utf-8")
                        desc=f.read()
                        #print desc
                        f.close()
                        descriptions.append(desc)
    return descriptions
