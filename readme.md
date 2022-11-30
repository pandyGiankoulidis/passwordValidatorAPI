# Brute force cracking time estimation
In our measures, a parallel GPU with more than operation on time is considered

## MD5 brute force cracking time
MD5 is no longer considered a safe hashing for storing passwords.Although MD5 hashes are not convertible,modern computers can quickly generate billions of MD5 hashes from random words,
therefore finding in reasonable time the password that generated a particular hash.Possible brute-force attacks from 
these computers can crack an 8-characters password in a few minutes.\
The best solution to avoid password cracking with passowrds hashed using MD5 hash is a lenghty password of at least 14 characters.\
The api call "/pwordValidation/validate" returns in its responce object a member with information about the estimated cracking time using
brute force attacks in passwords stored after a MD5 hashing.An example responce is as below
~~~ 
"MD5bruteForceCrackingTime": {
        "years": "0",
        "months": "0",
        "days": "0",
        "hours": "0",
        "minutes": "0",
        "seconds": 1.7276050285714286e-7
    },
~~~ 


