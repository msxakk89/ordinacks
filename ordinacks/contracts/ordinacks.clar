
;; >> ordinacks <<
;; ordinacks avatars contract

;; >> SIP09 trait implementation<< 
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(define-non-fungible-token ordinacks uint)

;; >> constants <<
(define-constant ORDINACKS_DEPLOYER tx-sender)
(define-constant URL-ROOT "https://ordinals.com/inscription/")

;; >> error codes constants <<
(define-constant ERR_CANNOT_UNWRAP_TX_ID (err u100))
(define-constant ERR_ORDINACK_DOES_NOT_EXIST (err u101))
(define-constant ERR_NOT_ORDINACK_OWNER (err u102))

;; >> variables <<
(define-data-var last-token-id uint u0)

;; >> maps <<
;; ordinacksdb 
;; Scheme: 
;; ordinack_id | uint -maps-to-> ordinal_data | tuple
;; Comments:  
;; - tuple contains ordinal genesis field
;; - genesis field represents the ordinal bitcoin genesis tsx and hence must be 64 characters long
(define-map ordinacksdb uint {genesis: (string-ascii 64)})

;; >> private functions <<
;; get_genesis: obtain ordinal genesis tsx id for given ordinack avatar id
;; ARGs
;; id | uint | the ordinack id 
(define-private (get_genesis (id uint)) (get genesis (map-get? ordinacksdb id)))

;; >> read-only functions << 
;; get-ordinacks-deployer: get the ordinacks contract deployer
(define-read-only (get-ordinacks-deployer) ORDINACKS_DEPLOYER)

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
    (asserts! (<= id (var-get last-token-id)) ERR_ORDINACK_DOES_NOT_EXIST) 
    (asserts! (is-eq (nft-get-owner? ordinacks id) (some tx-sender)) ERR_NOT_ORDINACK_OWNER)
    (nft-transfer? ordinacks id sender receiver)
))