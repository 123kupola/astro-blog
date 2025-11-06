---
title: "JSON - objektna notacija JavaScripta"
description: "Kratek uvod v zgodovino in pomen JSON-a, zlasti v polju umetne inteligence"
date: "2025-11-04"
author: "Tech Team"
published: true
featured: false
tags: ["json", "javascript", "api", "ai", "slovenian"]
---

# JSON - objektna notacija JavaScripta

[JSON](https://sl.wikipedia.org/wiki/JSON) (JavaScript Object Notation) je lahka oblika zapisa podatkov, ki temelji na sintaksi JavaScripta. Čeprav je njegovo ime povezano z JavaScriptom, je JSON postal standardni format za izmenjavo podatkov med različnimi sistemi in programskimi jeziki.

## Zgodovina JSON-a

JSON je leta 2001 razvil [Douglas Crockford](https://en.wikipedia.org/wiki/Douglas_Crockford), programer pri podjetju State Software. Sprva je bil namenjen kot alternativa XML-u, ki je bil takrat priljubljen, vendar preveč obsežen za spletne aplikacije. Prva specifikacija JSON-a je bila objavljena leta 2002, leta 2005 pa je postal uradni standard ECMA-404.

Njegova preprostost in berljivost sta hitro pritegnili pozornost razvijalcev. Leta 2006 je Twitter začel uporabljati JSON za svoje API-je, kar je še dodatno povečalo njegovo priljubljenost.

## Zakaj je JSON pomemben?

JSON je postal temelj sodobnega spleta zaradi več razlogov:

- **Preprostost**: Sintaksa je človeku berljiva in stroju razumljiva
- **Lahkost**: Manjše datoteke kot XML, hitrejše prenose
- **Univerzalnost**: Podpira več kot 20 programskih jezikov
- **Strukturiranost**: Omogoča hierarhične podatke z objekti in polji

## JSON v polju umetne inteligence

V svetu umetne inteligence ima JSON ključno vlogo:

### API-ji za AI storitve
Večina AI API-jev (OpenAI, Google AI, Anthropic) uporablja JSON za komunikacijo. Na primer, ko pošljete zahtevo AI modelu, podatki potujejo v JSON formatu:

```json
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Kaj je JSON?"}
  ],
  "temperature": 0.7
}
```

### Podatkovne množice za strojno učenje
JSON se pogosto uporablja za shranjevanje in izmenjavo podatkovnih množic. Formati kot COCO (za računalniški vid) ali SQuAD (za vprašanja in odgovore) temeljijo na JSON-u.

### Konfiguracijske datoteke
AI modeli in ogrodja (TensorFlow, PyTorch) uporabljajo JSON za konfiguracijo parametrov, arhitektur modelov in nastavitev treninga.

### Mikrostoritve in orkestracija
V AI sistemih, ki temeljijo na mikrostoritvah, JSON omogoča učinkovito komunikacijo med različnimi komponentami - od podatkovnih tokov do rezultatov modelov.

JSON je postal nepogrešljiv del AI ekosistema, saj omogoča hitro, zanesljivo in standardizirano izmenjavo podatkov med različnimi sistemi in storitvami.