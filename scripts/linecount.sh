echo "Band's smart contract LOC (excluding /mock folder) ..."

grep --exclude-dir mock -e '^\s*$' -r contracts | wc -l | awk '{print "Blanks (^\\s*$): "$1}'
grep --exclude-dir mock -e '^import.*$' -r contracts | wc -l | awk '{print "Imports (^import.*$): "$1}'
grep --exclude-dir mock -e '^\s*///.*$' -r contracts | wc -l | awk '{print "Comments (^\\s*///.*$): "$1}'
grep --exclude-dir mock -v \
    -e '^\s*$' \
    -e '^import.*$' \
    -e '^\s*///.*$' -r contracts | wc -l | awk '{print "Code: "$1}'
