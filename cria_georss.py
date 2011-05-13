import csv
from geopy import geocoders
import json
import os

KEY = "ABQIAAAAyfn6gBmxwpyQxtGGaRkVLRS8-UheS-9Mv04KIr8hplvk5vm4LxS4PcgQhGbscOKXiJYc3mjdbgu0jg"
g = geocoders.Google(KEY)
rows = csv.reader(open('OcorMunic2010.csv', 'rb')) # base dados com ocorrencias
data = {}
erros = []
f_erros = open("erros.txt", "w") # arquivo com as localizacoes nao encontradas pelo google maps

if os.path.exists("localizacoes.json"):
    f_local = open("localizacoes.json")
    localizacoes = json.load(f_local)
else:
    localizacoes = {} # mapa com a localizacao de cada cidade do RS

i = 0
for row in rows:
    if i == 0:
        i+=1
        continue
#    elif i > 100:
#        break
   
#    print row
    cidade = row[0]
    if cidade in erros: # se deu erro entao pula
        print "Erro: ", cidade
        continue
    try:
#    if True:
        if not data.has_key(cidade):
            print "Nova cidade:", cidade
            local = cidade + ", Rio Grande do Sul, Brasil"
            if cidade in localizacoes:
                (lat, lng) = localizacoes[cidade]
            else:
                place, (lat, lng) = g.geocode(local)
            data[cidade] = {}
            data[cidade]['nome'] = "\""+cidade+"\""
            data[cidade]['ocorrencias'] = []
            data[cidade]['titulo'] = "\"%s\": %.5f, %.5f" % (cidade, lat, lng)
            data[cidade]['info'] = []
            data[cidade]['latitude'] = lat
            data[cidade]['longitude'] = lng
            localizacoes[cidade] = (lat, lng)
            #print data[cidade]['titulo']

        data[cidade]['info'].append({"data":row[1], "ocorrencia":"\""+row[2]+"\"", "quantidade":row[3]})
        print cidade, {"data":row[1], "ocorrencia":row[2], "quantidade":row[3]}
        #print row
        i+=1
    except:
        erros.append(cidade)
        f_erros.write(cidade+"\n")

f_erros.close()

l = open("localizacoes.json", mode='a+')    
l.truncate(0)
json.dump(localizacoes, l)
l.close()

path = 'database.json'
f = open(path, mode='a+')    
f.truncate(0)
cidades = []
for c in data:
    cidades.append(data[c])
    print data[c]
data = {"data": cidades}
json.dump(data, f)
f.close()

print "FIM"

