CIRCLE_BRANCH=master
build=1
if [[ ${CIRCLE_BRANCH} == "master" ]]; then
    build="0"
  fi
echo "${build}"

if [[ ${build} == 0]]; then
  echo "MASTER NOT BUILD"
  exit 0
  fi


  

#first commit in a branch
if [[ ${LAST_SUCCESSFUL_COMMIT} == "null" ]]; then
              COMMITS="origin/master"
            else
              COMMITS="${CIRCLE_SHA1}..${LAST_SUCCESSFUL_COMMIT}"
              # COMMITS="master..${LAST_SUCCESSFUL_COMMIT}"
            fi