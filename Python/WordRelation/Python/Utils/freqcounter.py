#!/usr/local/bin/python
# -*- coding: utf-8 -*-
from __future__ import division

def getFreqForWord(word,nGrams):
    freq=0
    totalWords=0
    for nGram in nGrams:
        if word == nGram[0]:
            freq+=1
        totalWords+=1
    return freq/totalWords


def getWordsFreqInNgrams(nGrams):
    wordsListGeneral=[]
    wordsFreq={}
    for nGram in nGrams:
        wordsListNgram=[]
        for word in nGram:
            if(word not in wordsListNgram):
                wordsListNgram.append(word)
                if(word in wordsListGeneral):
                    wordsFreq[word]+=1
                else:
                    wordsListGeneral.append(word)
                    wordsFreq[word]=1
    return wordsFreq,wordsListGeneral

def getWordAndTwoWordsFreqInNgrams(specialWord,nGrams):
    twoWordsFreq={}
    #dictionary,list(string)
    wordsFreq,wordsListGeneral=getWordsFreqInNgrams(nGrams)
    for word in wordsListGeneral:
        hasAtLeastOne=False
        for nGram in nGrams:
            if(word!=specialWord):
                if((specialWord in nGram) and (word in nGram)):
                    hasAtLeastOne=True
                    key=u'_'.join((specialWord, word)).strip()
                    if(key in twoWordsFreq):
                        twoWordsFreq[key]+=1
                    else:
                        twoWordsFreq[key]=1
        if(hasAtLeastOne==False):
            key=u'_'.join((specialWord, word)).strip()
            twoWordsFreq[key]=0

    print ("\n\n\n\n")
    return wordsFreq,twoWordsFreq,wordsListGeneral

#Using conditional probability
def getWordsListWithRelation(specialWord,nGrams,lambd,numResults):
    wordsFreq,twoWordsFreq,wordsListGeneral=getWordAndTwoWordsFreqInNgrams(specialWord,nGrams)
    wordsRelation={}
    N=0
    if(len(nGrams)>0 and lambd!=0):
        N=len(nGrams)+numResults
    for word in wordsListGeneral:
        if(word!=specialWord):
            key=u'_'.join((specialWord, word)).strip()
            wordsRelation[word]=(twoWordsFreq[key]+lambd)/(wordsFreq[word]+(lambd*N))
    return wordsRelation.items()
