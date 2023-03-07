;; >> utils <<
;; utilities contract for ordinacks avatars

;; >> read-only functions << 
;; source: Clarity discord channel 
;; asci2buff: convert asci to buffer
;; ARGs
;; in | (string-ascii 100) | the string we wish to convert to buffer
(define-read-only (asci2buff (in (string-ascii 100)))
    (fold ascii2buff_matcher in 0x)
)

;; >> private functions <<
;; ascii2buff_matcher: match single asci character with buff element
;; ARGs
;; chr | (string-ascii 1) | the single asci string we wish to convert
;; out | (buff 100) | the starting buffer to which elements are appended
(define-private (ascii2buff_matcher (chr (string-ascii 1)) (out (buff 100)))
    (match (index-of " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" chr) idx
        (match (element-at 0x202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F606162636465666768696A6B6C6D6E6F707172737475767778797A7B7C7D7E idx) x
            (unwrap-panic (as-max-len? (concat out x) u100))
            out
        )
        out
    )
)


;; >> pub2btc <<
;; library for converting public keys to bitcoin addresses
;; source: https://github.com/jiga/pub2btc

;; list of buff to byte mappings
(define-constant BUFF_TO_BYTE
	(list
		0x00 0x01 0x02 0x03 0x04 0x05 0x06 0x07 0x08 0x09 0x0a 0x0b 0x0c 0x0d 0x0e 0x0f
		0x10 0x11 0x12 0x13 0x14 0x15 0x16 0x17 0x18 0x19 0x1a 0x1b 0x1c 0x1d 0x1e 0x1f
		0x20 0x21 0x22 0x23 0x24 0x25 0x26 0x27 0x28 0x29 0x2a 0x2b 0x2c 0x2d 0x2e 0x2f
		0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39 0x3a 0x3b 0x3c 0x3d 0x3e 0x3f
		0x40 0x41 0x42 0x43 0x44 0x45 0x46 0x47 0x48 0x49 0x4a 0x4b 0x4c 0x4d 0x4e 0x4f
		0x50 0x51 0x52 0x53 0x54 0x55 0x56 0x57 0x58 0x59 0x5a 0x5b 0x5c 0x5d 0x5e 0x5f
		0x60 0x61 0x62 0x63 0x64 0x65 0x66 0x67 0x68 0x69 0x6a 0x6b 0x6c 0x6d 0x6e 0x6f
		0x70 0x71 0x72 0x73 0x74 0x75 0x76 0x77 0x78 0x79 0x7a 0x7b 0x7c 0x7d 0x7e 0x7f
		0x80 0x81 0x82 0x83 0x84 0x85 0x86 0x87 0x88 0x89 0x8a 0x8b 0x8c 0x8d 0x8e 0x8f
		0x90 0x91 0x92 0x93 0x94 0x95 0x96 0x97 0x98 0x99 0x9a 0x9b 0x9c 0x9d 0x9e 0x9f
		0xa0 0xa1 0xa2 0xa3 0xa4 0xa5 0xa6 0xa7 0xa8 0xa9 0xaa 0xab 0xac 0xad 0xae 0xaf
		0xb0 0xb1 0xb2 0xb3 0xb4 0xb5 0xb6 0xb7 0xb8 0xb9 0xba 0xbb 0xbc 0xbd 0xbe 0xbf
		0xc0 0xc1 0xc2 0xc3 0xc4 0xc5 0xc6 0xc7 0xc8 0xc9 0xca 0xcb 0xcc 0xcd 0xce 0xcf
		0xd0 0xd1 0xd2 0xd3 0xd4 0xd5 0xd6 0xd7 0xd8 0xd9 0xda 0xdb 0xdc 0xdd 0xde 0xdf
		0xe0 0xe1 0xe2 0xe3 0xe4 0xe5 0xe6 0xe7 0xe8 0xe9 0xea 0xeb 0xec 0xed 0xee 0xef
		0xf0 0xf1 0xf2 0xf3 0xf4 0xf5 0xf6 0xf7 0xf8 0xf9 0xfa 0xfb 0xfc 0xfd 0xfe 0xff))

;; List with 25 items, used for folding something 25 times
(define-constant IDX_25
	(list
		u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11 u12 u13 u14 u15 u16 u17 u18 u19 u20 u21 
		u22 u23 u24))

;; Convert a 1-byte buff into a uint.
(define-private (buff-to-u8 (byte (buff 1)))
	(unwrap-panic (index-of BUFF_TO_BYTE byte)))


(define-private
	(count-leading-zeros-fold
		(i uint)
		(in { data: ( buff 32) ,count: uint}))
	(unwrap-panic
		(if (is-eq u0
				(buff-to-u8 (unwrap-panic (element-at (get data in) i))))
			(ok { data: ( get data in) ,count: ( + (get count in) u1) })
			(ok in))))

(define-private (count-leading-zeros (data ( buff 25)))
	(get count
		(fold count-leading-zeros-fold IDX_25 { data: data ,count: u0 })))

(define-constant IDX_34
	(list
		u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11 u12 u13 u14 u15 u16 u17 u18 u19 u20 u21 
		u22 u23 u24 u25 u26 u27 u28 u29 u30 u31 u32 u33))

;; list with Base58 alphabets
(define-constant B58_ALPHABETS
	(list 
		"1" "2" "3" "4" "5" "6" "7" "8" "9" 
		"A" "B" "C" "D" "E" "F" "G" "H" "J" 
		"K" "L" "M" "N" "P" "Q" "R" "S" "T" 
		"U" "V" "W" "X" "Y" "Z" 
		"a" "b" "c" "d" "e" "f" "g" "h" "i" 
		"j" "k" "m" "n" "o" "p" "q" "r" "s" 
		"t" "u" "v" "w" "x" "y" "z"))

(define-private (buff-slice-fold (i uint) (in { src: (buff 32), dst: (buff 32)}))
  (let 
	(
		(data (get src in))
		(dst (get dst in))
	)
	{
		src: data,
		dst: (unwrap-panic (as-max-len? (concat dst (unwrap-panic (element-at data i))) u32))
  	}
  )
)

;; slice buffer using list of indexes to pluck
(define-private (buff-slice (data (buff 32)) (indices (list 24 uint)))
	(get dst (fold buff-slice-fold indices {src: data, dst: 0x})))

(define-private (b58-encoder-step (i uint) (in { data: (buff 25), carry: uint, b58buff: (buff 25)}))
	(let
		(
			(icarry (get carry in))
			(b58buff (get b58buff in))
			(data (get data in))
			(buf (buff-to-u8 (unwrap!  (element-at data i) in)))
			(tcarry (+ buf (* u256 icarry)))
			(b58e (/ tcarry u58))
			(carry (mod tcarry u58))
		)
		{
			data: data,
			carry: carry,
			b58buff: (unwrap-panic (as-max-len? (concat b58buff (unwrap-panic (element-at BUFF_TO_BYTE b58e))) u25)),
		}
	)
)

(define-private
	(buff-to-b58
		(i uint)
		(in { data: ( buff 25), b58out: (string-ascii 34) }))
	(let
		(
			(it {data: (get data in), b58buff: 0x, carry: u0 })
			(result (fold b58-encoder-step IDX_25 it))
		)
		{
			data: (get b58buff result),
			b58out: (unwrap-panic (as-max-len? (concat (unwrap-panic (element-at B58_ALPHABETS (get carry result))) (get b58out in)) u34)),
		}
	)
)

;; base58check encoder 
(define-private (base58check-encode (version (buff 1)) (data (buff 520)))
	(let
		(
			(dhash (concat version (hash160 data)))
			(ihash (sha256 (sha256 dhash)))
			(chash (unwrap-panic (as-max-len? (concat dhash (buff-slice ihash (list u0 u1 u2 u3))) u25)))
			(in { data: chash, b58out: "" })
			(result (fold buff-to-b58 IDX_34 in))
		)
		(ok (get b58out result))
	)
)

;; check to make sure input key is in compressed format else funds may be lost forever
(define-read-only (is-compressed-pubkey (pubki (buff 33)))
	(let
		(
			(type (buff-to-u8 (unwrap! (element-at pubki u0) false)))
		)
		(or (is-eq type u2) (is-eq type u3))
	)
)

(define-constant ERR_PUBKEY_NOT_COMPRESSED (err "Public key is not compressed"))

;; function to convert compressed public key to p2pkh format
(define-read-only (to-p2pkh (pubki (buff 33)))
	(begin 
		(asserts! (is-compressed-pubkey pubki) ERR_PUBKEY_NOT_COMPRESSED)
		(base58check-encode 0x00 pubki)
	)
)

;; function to convert redeem script to p2sh format
(define-read-only (to-p2sh (redeemScript (buff 520)))
	(base58check-encode 0x05 redeemScript)
)

;; function to convert compressed public key to wrapped p2wpkh aka segwit format
(define-read-only (to-p2sh-p2wpkh (pubki (buff 33)))
	(begin 
		(asserts! (is-compressed-pubkey pubki) ERR_PUBKEY_NOT_COMPRESSED)
		(to-p2sh (concat 0x0014 (hash160 pubki)))
	)
)

