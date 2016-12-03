#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import tokenizer

def makeNGramList(text,n):
    listNGram=[]
    listTokens=tokenizer.makeTokensList(text)
    for i in range(0, len(listTokens)-n+1):
        ngram=[]
        for j in range(0,n):
            ngram.append(listTokens[i+j])
        listNGram.append(ngram)
    return listNGram

def makeNGramListFromTextList(textList,n):
    nGramsList=[]
    for text in textList:
        miniNGramList=makeNGramList(text,n)
        nGramsList.extend(miniNGramList)
    return nGramsList
