#!/usr/local/bin/python
# -*- coding: utf-8 -*-
import sys
sys.path.append('Utils')
sys.path.append('Graphics')
sys.path.append('Webutils')
import websearcher
import cleaner
import ngramer
import freqcounter
import sorter
import writer

def runmain():
    print("Ingresa una palabra:\n")
    s = raw_input('--> ')
    print("Ingresa el tamaño de los ngramas:\n")
    n = input('--> ')
    numResults=20
    #Busca en bing
    descriptionsList=websearcher.getResultsDescriptionList(s,numResults)
    #Limpia la lista de signos de puntuación y palabras de baja información
    cleanList=cleaner.removeMarksAndLowInfoWordsFromList(descriptionsList,"../Resources/low_info_words.txt")
    #Genera los 3gramas en una lista de listas
    nGramsList=ngramer.makeNGramListFromTextList(cleanList,n)
    #Obtiene la probabilidad condicional de la palabra dada con cada palabra del texto en una lista de tuplas
    #Se pasa el valor de lambda de 1 para el smoothing de Laplace, también se pasa el número de resultados
    #para calcular el número de N-1 gramas
    wordsRelation=freqcounter.getWordsListWithRelation(s,nGramsList,1,numResults)
    #Ordena de mayor a menor las relaciones
    wordsRelationOrdered=sorter.sortListOfTuples(wordsRelation)
    #Guarda en un archivo de texto las listas de tuplas
    #writer.writeListOfTuples("../Outputs/"+s+str(n)+"gramas.txt",wordsRelationOrdered)
    writer.writeDataForD3("../../../Resources/data.json",s,wordsRelationOrdered,100,10)

    """
    for wordR in wordsRelationOrdered:
        print("Word: "+wordR[0]+" Relation: "+str(wordR[1]))
    """

if __name__ == "__main__":
    # execute only if run as a script
    runmain()