#!/usr/local/bin/python
# -*- coding: utf-8 -*-


def sortListOfTuples(listOfTuples):
    sortedByNumber = sorted(listOfTuples, key=lambda tup: tup[1], reverse=True)
    return sortedByNumber
