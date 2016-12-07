#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import codecs
import json

def writeText(path,text):
    target = open(path, 'w')
    target.write(text)
    target.close()

def writeListOfTuples(path,listOfTuples):
    target = codecs.open(path, 'w', 'utf-8')
    for t in listOfTuples:
        target.write(t[0]+" : "+str(t[1])+"\n")
    target.close()

def writeDataForD3(path,mainWord,listOfTuples, maxNodes, numGroups): #TODO: add levels of links
    target = codecs.open(path, 'w', 'utf-8')

    jsonV={}
    nodes=[]
    links=[]
    #Adds target word node
    node={}
    node["id"]=mainWord
    node["group"]=100
    nodes.append(node)
    print(listOfTuples)
    #max nodes to appear
    num=maxNodes
    if len(listOfTuples)<num:
        num=len(listOfTuples)

    #group and distance normalization
    maxV=listOfTuples[0][1]
    minV=listOfTuples[num-1][1]
    rangeDistance=(maxV-minV)/numGroups

    for i in range(0,num):
        group=(numGroups)-int((listOfTuples[i][1]-minV)/rangeDistance)
        node={}
        node["id"]=listOfTuples[i][0]
        node["group"]=group
        nodes.append(node)

        link={}
        link["source"]=mainWord
        link["target"]=listOfTuples[i][0]
        link["value"]=group+5
        links.append(link)

    jsonV["nodes"]=nodes
    jsonV["links"]=links

    cadena=str(jsonV)
    cadena=cadena.replace("\\",'')
    cadena=cadena.replace("u'",'"')
    cadena=cadena.replace("'",'"')
    target.write(cadena)

    target.close()
    return cadena;
