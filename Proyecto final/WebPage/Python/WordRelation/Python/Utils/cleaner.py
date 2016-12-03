#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import re

#Removes punctuation marks
def reSubFunction(matchobj):
    if(matchobj.group(0).startswith(' ')):
        return ' '
    return ''
def cleanMarks(text):
    cleanTex=re.sub(u"[()!¡¿?,.;:\|\'\`\"\—\-\[\]]|( [a-z] )|( [0-9] )",reSubFunction,text)
    return cleanTex


def cleanLowInfoWords(text,lowInfoWordsPath):
    cleanTex=""+text
    with open(lowInfoWordsPath) as f:
        for line in f:
            word=line[:-1].decode('utf8')
            cleanTex=cleanTex.replace(" "+word+" "," ")
    return cleanTex

def removeMarksFromList(textList):
    cleanList=[]
    for text in textList:
        cleanList.append(cleanMarks(text.lower()))
    return cleanList

def removeMarksAndLowInfoWordsFromList(textList,lowInfoWordsPath):
    cleanList=[]
    cleanList2=[]
    cleanList3=[]
    #Cleaned three times to remove Low Info Words that are together
    for text in textList:
        #blank space at beginning of text to correctly remove low info words
        cleanList.append(cleanLowInfoWords(cleanMarks(" "+text.lower()),lowInfoWordsPath))
    for text in cleanList:
        #blank space at beginning of text to correctly remove low info words
        cleanList2.append(cleanLowInfoWords(cleanMarks(" "+text.lower()),lowInfoWordsPath))
    for text in cleanList2:
        #blank space at beginning of text to correctly remove low info words
        cleanList3.append(cleanLowInfoWords(cleanMarks(" "+text.lower()),lowInfoWordsPath))
    return cleanList3
