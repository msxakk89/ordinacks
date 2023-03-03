;; >> ordinacks-mint <<
;; the mint contract for the ordinacks (ordinal avatars)
;; NOTE: this contract assumes that ordinacks contract has been deployed by ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

;; >> constants <<
(define-constant REQUEST_PRICE u5000000)

;; >> error codes constants <
(define-constant ERR_NOT_ORDINACKS_DEPLOYER (err u200))
(define-constant ERR_CANNOT_GET_LAST_TOKEN_ID (err u201))
;; >> variables <<
(define-data-var last-request-id uint u0)

;; >> maps <<
;; avataring-requests-db
;; Scheme: request_id | uint  -maps-to-> request_data | tuple
;; Comments: 
;; - tuple cotains the following fields: 
;; * msg -> must be of (string-ascii 64) type containing ordinal genesis tsx
;; * sig -> must be of (buff 65) type representing the digital signature generated with secp256k1 signrec algorithm upon the msg
;; NOTICE     : Request id matches the Ordinack id in ordinacks contract
;; ATTENTION! : The sig must be generated with private key behind the BTC address on which ordinal "sits"
;; ATTENTION! : Failure to sign with private key behind the BTC address on which ordinal "sits" will result in no avataring
;; ATTENTION! : The only way to ensure avataring of ordinal to create ordinack is through signing with private key that controls the BTC address on which ordinal "sits" 
;; ATTENTION! : Failure to use a valid ordinal genesis tsx will not result in avataring of the ordinal even if valid sig is provided   
(define-map avataring-requests-db uint {msg: (string-ascii 64),
                                        sig: (buff 65)})

;; >> private functions <<
(define-private (verify)
    (ok true)
)

;; check a pending request
(define-private (check-request)
    (ok true)
)

;; >> read-only functions << 
;; 
(define-read-only (is-pending) 
(let 
    (
      ( last-token-id (unwrap! (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ordinacks get-last-token-id) ERR_CANNOT_GET_LAST_TOKEN_ID))
    )
    (if (> (var-get last-request-id) last-token-id) (ok true) (ok false))
  )
)
;; >> public functions <<
(define-public (mint-ordinack)
    (begin  
    (ok true)
    )
)


