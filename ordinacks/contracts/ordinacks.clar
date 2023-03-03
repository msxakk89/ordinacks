;; >> ordinacks <<
;; ordinacks avatars contract
;; also for avataring request, avataring request inspection and minting functionalities
;; payment for avataring request goes to the current contract owner
;; reviewing request, setting price and new owner can be done by either deployer or current owner

;; >> SIP09 trait implementation<< 
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(define-non-fungible-token ordinacks uint)

;; >> constants <<
(define-constant DEPLOYER tx-sender)
(define-constant URL-ROOT "https://ordinals.com/inscription/")

;; >> error codes constants <<
(define-constant ERR_CANNOT_UNWRAP_TX_ID (err u100))
(define-constant ERR_NOT_VALID_SIGNATURE (err u102))
(define-constant ERR_CANNOT_UNWRAP_PUB_KEY (err u103))
(define-constant ERR_UNAUTHORISED (err u104))
(define-constant ERR_HAS_NOT_PASSED_REVIEW (err u105))
(define-constant ERR_CANNOT_ACCESS_REQUEST_DATA (err u106))
(define-constant ERR_NOT_OWNER_OR_DEPLOYER (err u107))
(define-constant ERR_NO_NEW_REQUESTS_TO_APPROVE (err u108))
;; >> variables <<
(define-data-var last-token-id uint u0)
(define-data-var last-request-id uint u0)
(define-data-var last-request-id-reviewed uint u0)
(define-data-var request_price uint u5000000)
(define-data-var contract_owner principal tx-sender)

;; >> maps <<
;; avataring-requests-db
;; Scheme: request_id | uint  -maps-to-> request_data | tuple
;; Comments: 
;; - tuple cotains the following fields: 
;; * genesis -> must be of (string-ascii 64) type containing ordinal genesis tsx
;; * sig -> must be of (buff 65) type representing the digital signature generated with secp256k1 signrec algorithm upon the genesis msg
;; * approved -> must be bool type representing approval outcome for avataring contingent on the ordinal existing at the provided address
;; Comments:
;; NOTE : request_id matches ordinal_id in ordinacksdb
;; ATTENTION! : The sig must be generated with private key behind the BTC address on which ordinal "sits"
;; ATTENTION! : Failure to sign with private key behind the BTC address on which ordinal "sits" will result in no avataring
;; ATTENTION! : The only way to ensure avataring of ordinal to create ordinack is through signing with private key that controls the BTC address on which ordinal "sits" 
;; ATTENTION! : Failure to use a valid ordinal genesis tsx will not result in avataring of the ordinal even if valid sig is provided   
(define-map avataring-requests-db uint {genesis: (string-ascii 64),
                                        sig: (buff 65),
                                        requester: principal,
                                        approved: bool })
;; ordinacksdb 
;; Scheme: 
;; ordinack_id | uint -maps-to-> ordinal_data | tuple
;; Comments:  
;; - there 1-2-1 relationship between ordinacksdb key and avataring-requests-db key
;; - tuple contains ordinal genesis field
;; - genesis field represents the ordinal bitcoin genesis tsx and hence must be 64 characters long
(define-map ordinacksdb uint {genesis: (string-ascii 64)})

;; >> private functions <<
;; get_genesis: obtain ordinal genesis tsx id for given ordinack avatar id
;; ARGs
;; id | uint | the ordinack id 
(define-private (get_genesis (id uint)) (get genesis (map-get? ordinacksdb id)))

;; >> read-only functions << 
;; how-many-pending: inform caller how many submission need to be reviewed
;; (define-read-only (how-many-pending) 
;;   (- (var-get last-request-id) (var-get last-request-id-reviewed) )
;; )

;; check-last-request-id-reviewed: check the id of lastly reviewed request
;; (define-read-only (check-last-request-id-reviewed) (var-get last-request-id-reviewed))
;; check-lastrequest-id: check the id of lastly added id to avataring-requests-db
;;(define-read-only (check-last-request-id-reviewed) (var-get last-request-id))

;; inspect-request: show data associated with given reguest id
(define-read-only (inspect-request (request_id uint)) 
    (map-get? avataring-requests-db request_id)
)

;; get-ordinacks-deployer: get the ordinacks contract deployer
(define-read-only (get-deployer) DEPLOYER)

;; get-last-token-id: get the id of the last minted ordinack
(define-read-only (get-last-token-id) 
  (ok (var-get last-token-id))
)
;; get-token-uri: return uri from ordinals.com server corresponding to the minted ordinack 
;; ARGs
;; id | uint | the ordinack id 
(define-read-only (get-token-uri (id uint)) 
  (ok (some 
      (concat URL-ROOT
              (unwrap! (get_genesis id) ERR_CANNOT_UNWRAP_TX_ID))))
)
;; get-owner: return the principal owning the ordinack avatar
;; ARGs
;; id | uint | the ordinack id 
(define-read-only (get-owner (id uint))
  (ok (nft-get-owner? ordinacks id))
)
;; >> public functions <<
;; transfer: transfer ordinack avatar from sender to receiver
;; ARGs
;; id | uint | the ordinack id 
;; sender | principal | currnet ordinack owner
;; receiver | principal | principal that will receive the ordinack
(define-public (transfer (id uint) (sender principal) (receiver principal))
  (begin
    (asserts! (is-eq (nft-get-owner? ordinacks id) (some tx-sender)) ERR_UNAUTHORISED)
    (nft-transfer? ordinacks id sender receiver)
))
;; submit-avataring-request: submit a request for avataring an ordinal
;; ARGs
;; genesis | (string-ascii 64) | msg containing ordinal genesis tsx, that was signed with private key behind public key of the btc address where the ordinal exists
;; sig | (buff 65) | digital signature generated with secp256k1 signrec algorithm upon the msg containing ordinal genesis tsx id
;; ATTENTION! : not valid signature will prevent registering avataring request
;; ATTENTION! : if valid signature is provided but ordinal does not exist at the correct address, fee will be paid but no ordinack issued
(define-public (submit-avataring-request (genesis (string-ascii 64)) (sig (buff 65))) 
    (let
        (
        (msg_buff (contract-call? .utils asci2buff genesis))
        (msg_hash (sha256 msg_buff))
        (pub_key (unwrap! (secp256k1-recover? msg_hash sig) ERR_CANNOT_UNWRAP_PUB_KEY))
        (request-id (+ (var-get last-request-id) u1))
        )  
    (asserts! (secp256k1-verify msg_hash sig pub_key) ERR_NOT_VALID_SIGNATURE) ;; checks if provided signature is valid
    (try! (stx-transfer? (var-get request_price) tx-sender (var-get contract_owner) )) ;; pay ordinacks contract owner avataring registration fee
    (map-insert avataring-requests-db request-id 
            { genesis: genesis,
              sig: sig,
              requester: tx-sender,
              approved: false} ;; the default approved field is false; is changed by orinacks contract owner into true or left as false
    )
    (var-set last-request-id request-id)
    (ok true)
    )
)

;; approve-submission
;; ARGs
;; request_id | uint | the request id for which we want to approve submission
(define-public (approve-submission (request_id uint)) 
  (begin  
  (asserts! (or (is-eq tx-sender (var-get contract_owner))
                (is-eq tx-sender DEPLOYER)
            ) ERR_UNAUTHORISED)
  (asserts! (> request_id (var-get last-request-id)) ERR_NO_NEW_REQUESTS_TO_APPROVE) ;; ensure that request_id is greater than the last request_id that was approved
  (map-set avataring-requests-db  request_id 
                                  (merge (unwrap! (map-get? avataring-requests-db request_id) ERR_CANNOT_ACCESS_REQUEST_DATA) {approved: true}))
  (var-set last-request-id-reviewed (+ (var-get last-request-id-reviewed) u1))
  (ok true)
  )
)

;; mint-ordinack: mint an ordinack if you are deployer and have approved ordinal exists at a given address
;; ARGs
;; request_id | uint | the request id for which we want to complete the ordinal avataring 
;; Comments:
;; - only deployer or current contract owner can call this function
(define-public (mint-ordinack (request_id uint))
    (let   
        (
        (requester (unwrap! (get requester (map-get? avataring-requests-db request_id)) ERR_CANNOT_ACCESS_REQUEST_DATA))
        (has_passed_review (unwrap! (get approved (map-get? avataring-requests-db request_id)) ERR_CANNOT_ACCESS_REQUEST_DATA))
        (genesis (unwrap! (get genesis (map-get? avataring-requests-db request_id)) ERR_CANNOT_ACCESS_REQUEST_DATA))
        )   
    (asserts! (or (is-eq tx-sender (var-get contract_owner))
                (is-eq tx-sender DEPLOYER)
            ) ERR_UNAUTHORISED) ;; ensure only ordinacks deployer can mint ordinacks
    (asserts! (is-eq has_passed_review true) ERR_HAS_NOT_PASSED_REVIEW) ;; ensure avataring request has been approved
    (try! (nft-mint? ordinacks request_id requester)) ;; request_id matches ordinal_id
    (map-insert ordinacksdb request_id {genesis: genesis}) ;; insert new instance of ordinack
    (ok true)
    )
)
;; change-requesting-price: change the price of request submission
;; ARGs
;; new_price | uint | the new price 
;; Comments:
;; - only deployer or current contract owner can call this function
(define-public (change-requesting-price (new_price uint))
  (begin 
  (asserts! (or (is-eq tx-sender (var-get contract_owner))
                (is-eq tx-sender DEPLOYER)
            ) ERR_UNAUTHORISED)
  (var-set request_price new_price) 
  (ok true)
  )
)
;; change-contract-owner: change the owner of ordinacks contract
;; ARGs
;; new_owner | principal | the new owner the current owner or deployer wish to set
;; Comments:
;; - only deployer or current contract owner can call this function
(define-public (change-contract-owner (new_owner principal))
  (begin 
  (asserts! (or (is-eq tx-sender (var-get contract_owner))
                (is-eq tx-sender DEPLOYER)
            ) ERR_NOT_OWNER_OR_DEPLOYER)
  (var-set contract_owner new_owner) 
  (ok true))
)
