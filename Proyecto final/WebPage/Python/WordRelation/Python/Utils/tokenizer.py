#!/usr/local/bin/python
# -*- coding: utf-8 -*-
from nltk.stem import SnowballStemmer
import nltk

#Creates tokens
def makeTokensList(text):
    tokens=nltk.word_tokenize(text)
    return tokens

#Gets tokens stems
def appendTokensStem(tokensList):
    #To get stem associated to word
    stemmedTokens=[]
    stemmer=SnowballStemmer("spanish")
    #To count tokens and types
    numTokens=0
    numStems=0
    #To get stems frequency
    stemsList=[]
    stemsFrequency={}

    for token in tokensList:
        numTokens+=1

        st={}
        st["word"]=token
        stem=stemmer.stem(token)
        st["stem"]=stem
        stemmedTokens.append(st)

        if (stem in stemsList):
            stemsFrequency[stem]+=1
        else:
            stemsList.append(stem)
            stemsFrequency[stem]=1
            numStems+=1

    return stemmedTokens, numTokens, numStems, stemsFrequency.items()
