amount = 1256
denominations = {
  2000: 10,
  500: 10,
  100: 10,
  50: 2,
  20: 5,
  10: 10,
  5: 10,
  2: 10,
  1: 10
}

resultDenominations ={}

def hasDenmoination(denomination):
  return denominations[denomination]


def reduceDenomination(denomination):
  currentDenomination = denominations[denomination]
  denominations[denomination] = currentDenomination - 1

def addDenomination(denomination):
  if denomination in resultDenominations:
    currentDenomination = resultDenominations[denomination]
    resultDenominations[denomination] = currentDenomination + 1
  else:
    resultDenominations[denomination]=1

def calcDenomination(amount):
  if amount>=2000 and hasDenmoination(2000):
    reduceDenomination(2000)
    addDenomination(2000)
    calcDenomination(amount-2000)
  
  elif amount>=500 and hasDenmoination(500):
    reduceDenomination(500)
    addDenomination(500)
    calcDenomination(amount-500)
  
  elif amount>=100 and hasDenmoination(100):
    reduceDenomination(100)
    addDenomination(100)
    calcDenomination(amount-100)
  
  elif amount>=50 and hasDenmoination(50):
    reduceDenomination(50)
    addDenomination(50)
    calcDenomination(amount-50)
  
  elif amount>=20 and hasDenmoination(20):
    reduceDenomination(20)
    addDenomination(20)
    calcDenomination(amount-20)
  
  elif amount>=10 and hasDenmoination(10):
    reduceDenomination(10)
    addDenomination(10)
    calcDenomination(amount-10)
  
  elif amount>=5 and hasDenmoination(5):
    reduceDenomination(5)
    addDenomination(5)
    calcDenomination(amount-5)
  
  elif amount>=2 and hasDenmoination(2):
    reduceDenomination(2)
    addDenomination(2)
    calcDenomination(amount-2)
  
  elif amount>=1 and hasDenmoination(1):
    reduceDenomination(1)
    addDenomination(1)
    calcDenomination(amount-1)
  


calcDenomination(1150)
print(resultDenominations)


