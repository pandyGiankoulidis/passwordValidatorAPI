
# Password validator API
 An API for validating the strength of a password and its compatibility to some predefined requirements. A running version of the API can be found in the project rapid API [repo](https://rapidapi.com/pantelisgiankoulidis/api/password-validator)\
This API offers two operations: \
a) Password strength validation\
b) Password preferences compatibility


## Password strength validation
The password validation checks the given password's strength in brute force attacks. It calculates the password strength in such attacks, in cases the password is stored unhashed,or hashed with MD5,SHA256,MCrypt and BCrypt hashing.
In our measures, a parallel GPU with 10^15 operations per second is considered

### MD5 brute force cracking time
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
### SHA256 brute force cracking time
A better alternative for hashing is the SHA256 hash algorithm.
~~~
"SHA256bruteForceCrackingTime": {
        "best_case": {
            "years": 18,
            "months": 8,
            "days": 22,
            "hours": 0,
            "minutes": 2,
            "seconds": 37
        },
        "average_case": {
            "years": 6,
            "months": 5,
            "days": 26,
            "hours": 20,
            "minutes": 42,
            "seconds": 17
        }
    },
~~~


### Bcrypt brute force cracking time
A stronger option is the BCrypt hashing.
~~~
"BCryptbruteForceCrackingTime": {
        "best_case": {
            "years": 2,
            "months": 6,
            "days": 2,
            "hours": 19,
            "minutes": 56,
            "seconds": 26
        },
        "average_case": {
            "years": 2,
            "months": 6,
            "days": 2,
            "hours": 19,
            "minutes": 56,
            "seconds": 26
        }
    },
~~~

### Popularity of password
We measure the average levenhstein distance from the given password to more than 1000 popular passwords
~~~
"popularity": {
        "Average Edit Distances": {
            "levenshteinDistance": 1.228666114333057,
            "treeDistance": 2
        },
        "guessingDifficulty": 10
    }
~~~

## Password preferences compatibility
A user can store her password preferences, like length,uppercase letters etc. With the call "/pwordRequirements/checkRequirements?password=<password>" it returns whether the password meets the user's requirements or not.
It uses Jwt authentication in nodejs to authenticate the user.
~~~
{
    "message": "Digits are fewer than required.There must be at least 2 digits"
}
~~~


        
        
        
        
        
    
